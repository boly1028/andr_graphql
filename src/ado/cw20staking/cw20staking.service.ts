import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { AndrSearchOptions } from '../types'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types/ado.constants'
import { ConfigStructure, CW20StakingSchema, StakerResponse, CW20_STAKER_ADDRESS, StateStructure } from './types'

@Injectable()
export class CW20StakingService extends AdoService {
  constructor(
    @InjectPinoLogger(CW20StakingService.name)
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

  public async config(contractAddress: string): Promise<ConfigStructure> {
    try {
      const configResp = await this.wasmService.queryContract(contractAddress, CW20StakingSchema.config)

      return configResp as ConfigStructure
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async state(contractAddress: string): Promise<StateStructure> {
    try {
      const configResp = await this.wasmService.queryContract(contractAddress, CW20StakingSchema.state)

      return configResp as StateStructure
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async staker(contractAddress: string, address: string): Promise<StakerResponse> {
    try {
      const queryMsgStr = JSON.stringify(CW20StakingSchema.staker).replace(CW20_STAKER_ADDRESS, address)
      const queryMsg = JSON.parse(queryMsgStr)

      const stakerResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      return stakerResp as StakerResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async stakers(contractAddress: string, options?: AndrSearchOptions): Promise<StakerResponse[]> {
    try {
      const queryMsgStr = JSON.stringify(CW20StakingSchema.stakers)
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.stakers.limit = options?.limit
      if (options?.startAfter) queryMsg.stakers.start_after = options?.startAfter

      const stakersResp = await this.wasmService.queryContract(contractAddress, queryMsg)

      return stakersResp as StakerResponse[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async timestamp(contractAddress: string): Promise<JSON> {
    try {
      const timestamp = await this.wasmService.queryContract(contractAddress, CW20StakingSchema.timestamp)

      return timestamp as JSON
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
