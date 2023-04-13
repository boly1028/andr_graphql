import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { AndrSearchOptions } from '../types'
import { INVALID_QUERY_ERR } from '../types/ado.constants'
import { ConfigStructure, CW20StakingSchema, StakerResponse, CW20_STAKER_ADDRESS, StateStructure } from './types'

@Injectable()
export class CW20StakingService extends AdoService {
  constructor(
    @InjectPinoLogger(CW20StakingService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
  ) {
    super(logger, wasmService)
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
