import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { DEFAULT_CATCH_ERR, INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR } from '../types'
import {
  LockdropConfig,
  LockdropSchema,
  LockdropState,
  LockdropUserInfo,
  LOCKDROP_TIMESTAMP,
  LOCKDROP_USER_ADDRESS,
} from './types'

@Injectable()
export class LockdropService extends AdoService {
  constructor(
    @InjectPinoLogger(LockdropService.name)
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

  public async state(address: string): Promise<LockdropState> {
    try {
      const lockdropState = await this.wasmService.queryContract(address, LockdropSchema.state)
      return lockdropState as LockdropState
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async config(address: string): Promise<LockdropConfig> {
    try {
      const lockdropConfig = await this.wasmService.queryContract(address, LockdropSchema.config)
      return lockdropConfig as LockdropConfig
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async userInfo(address: string, user: string): Promise<LockdropUserInfo> {
    try {
      const queryMsgStr = JSON.stringify(LockdropSchema.user_info).replace(LOCKDROP_USER_ADDRESS, user)
      const queryMsg = JSON.parse(queryMsgStr)

      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse as LockdropUserInfo
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async withdrawalPercentAllowed(address: string, timestamp: number): Promise<number> {
    try {
      const queryMsgStr = JSON.stringify(LockdropSchema.withdrawal_percent_allowed).replace(
        '"' + LOCKDROP_TIMESTAMP + '"',
        String(timestamp),
      )
      const queryMsg = JSON.parse(queryMsgStr)

      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse as number
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
