import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { DEFAULT_CATCH_ERR, INVALID_QUERY_ERR } from '../types'
import { CrowdfundConfig, CrowdfundSchema, CrowdfundState, CROWDFUND_QUERY_TOKEN_ID } from './types'

@Injectable()
export class CrowdfundService extends AdoService {
  constructor(
    @InjectPinoLogger(CrowdfundService.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  //FIX: State not found
  public async state(address: string): Promise<CrowdfundState> {
    try {
      const crowdfundState = await this.wasmService.queryContract(address, CrowdfundSchema.state)
      return crowdfundState
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async config(address: string): Promise<CrowdfundConfig> {
    try {
      const crowdfundConfig = await this.wasmService.queryContract(address, CrowdfundSchema.config)
      return crowdfundConfig
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async availableTokens(address: string): Promise<string[]> {
    try {
      const queryResponse = await this.wasmService.queryContract(address, CrowdfundSchema.available_tokens)
      return queryResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async isTokenAvailable(address: string, tokenId: string): Promise<boolean> {
    const queryMsgStr = JSON.stringify(CrowdfundSchema.is_token_available).replace(CROWDFUND_QUERY_TOKEN_ID, tokenId)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResponse = await this.wasmService.queryContract(address, queryMsg)
      return queryResponse ?? false
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
