import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types'
import { VestingConfig, VestingSchema, VestingBatchInfo, VESTING_BATCH_ID } from './types'

@Injectable()
export class VestingService extends AdoService {
  constructor(
    @InjectPinoLogger(VestingService.name)
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

  public async config(address: string): Promise<VestingConfig> {
    try {
      const lockdropConfig = await this.wasmService.queryContract(address, VestingSchema.config)
      return lockdropConfig as VestingConfig
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async batch(address: string, id: number): Promise<VestingBatchInfo> {
    try {
      const queryMsgStr = JSON.stringify(VestingSchema.batch).replace('"' + VESTING_BATCH_ID + '"', String(id))
      const queryMsg = JSON.parse(queryMsgStr)

      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse as VestingBatchInfo
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async batches(address: string): Promise<VestingBatchInfo[]> {
    try {
      const queryResponse = await this.wasmService.queryContract(address, VestingSchema.batches)
      return queryResponse as VestingBatchInfo[]
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
