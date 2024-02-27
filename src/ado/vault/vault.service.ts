import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AdoService } from 'src/ado/ado.service'
import { Coin } from 'src/ado/types/common'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types'
import { AndrStrategy, VaultSchema, VAULT_QUERY_ADDRESS, VAULT_QUERY_STRATEGY } from './types'

@Injectable()
export class VaultService extends AdoService {
  constructor(
    @InjectPinoLogger(VaultService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async getChainId(address: string): Promise<string> {
    try {
      const chainId = await this.chainConfigService.getChainId(address)
      if (!chainId) throw new UserInputError(CHAIN_ID_NOT_FOUND_ERR)

      return chainId
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async balance(contractAddress: string, address: string): Promise<Coin[]> {
    const queryMsgStr = JSON.stringify(VaultSchema.balance).replace(VAULT_QUERY_ADDRESS, address)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(contractAddress, queryMsg)
      return queryResponse as Coin[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async strategyAddress(contractAddress: string, strategy: string): Promise<AndrStrategy> {
    const queryMsgStr = JSON.stringify(VaultSchema.strategy_address).replace(VAULT_QUERY_STRATEGY, strategy)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(contractAddress, queryMsg)
      return queryResponse as AndrStrategy
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
