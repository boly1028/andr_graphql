import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { InjectCosmClient } from 'src/cosm'
import {
  INTERNAL_CONTRACT_ERR,
  INVALID_QUERY_ERR,
  INVALID_REQUEST_TEXT,
  LOGGER_ERROR_QUERY_TEXT,
  LOGGER_ERROR_CONTRACT_TEXT,
  NOT_FOUND_ERR,
} from './types/wasm.constants'
import { WasmContract } from './types/wasm.contract'

@Injectable()
export class WasmService {
  constructor(
    @InjectPinoLogger(WasmService.name)
    protected readonly logger: PinoLogger,
    @InjectCosmClient()
    protected readonly cosmWasmClient: CosmWasmClient,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {}

  public async getContract(address: string, chainId?: string): Promise<WasmContract> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl(address, chainId)
      if (!chainUrl) throw new UserInputError(NOT_FOUND_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      const contractInfo = await queryClient.getContract(address)

      return contractInfo as WasmContract
    } catch (err: any) {
      this.logger.error({ err }, LOGGER_ERROR_CONTRACT_TEXT, address)

      const errMsg = err.toString()
      if (errMsg && errMsg.includes(INVALID_REQUEST_TEXT)) {
        throw new UserInputError(NOT_FOUND_ERR)
      }

      throw new ApolloError(INTERNAL_CONTRACT_ERR)
    }
  }

  public async queryContract(address: string, queryMsg: Record<string, unknown>, chainId?: string): Promise<any> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl(address, chainId)
      if (!chainUrl) throw new UserInputError(NOT_FOUND_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      const queryResult = await queryClient.queryContractSmart(address, queryMsg)

      return queryResult
    } catch (err: any) {
      this.logger.error({ err }, LOGGER_ERROR_QUERY_TEXT, address, queryMsg)
      throw new ApolloError(INVALID_QUERY_ERR, 'WASM_QUERYMSG_ERROR', { queryMsg })
    }
  }

  public async getContractQueries(address: string, chainId?: string): Promise<string[]> {
    let queries: string[] = []
    const pattern = /`.*?`/g
    let current: any

    try {
      const chainUrl = await this.chainConfigService.getChainUrl(address, chainId)
      if (!chainUrl) throw new UserInputError(NOT_FOUND_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      queries = await queryClient.queryContractSmart(address, { query_msgs: {} })

      return queries
    } catch (err: any) {
      const errMsg = err.toString()
      while ((current = pattern.exec(errMsg))) queries.push(current[0].replace(/`/g, ''))

      queries.shift()
      return queries
    }
  }
}
