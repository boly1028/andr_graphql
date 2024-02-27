import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types'
import {
  AccountDetails,
  CoinAllowance,
  RateLimitingWithdrawalsSchema,
  RATE_LIMITING_WITHDRAWALS_ACCOUNT,
} from './types'

@Injectable()
export class RateLimitingWithdrawalsService extends AdoService {
  constructor(
    @InjectPinoLogger(RateLimitingWithdrawalsService.name)
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

  public async coinAllowanceDetails(contractAddress: string): Promise<CoinAllowance> {
    try {
      const queryResp = await this.wasmService.queryContract(
        contractAddress,
        RateLimitingWithdrawalsSchema.coin_allowed_details,
      )
      return queryResp as CoinAllowance
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async accountDetails(contractAddress: string, account: string): Promise<AccountDetails> {
    const queryMsgStr = JSON.stringify(RateLimitingWithdrawalsSchema.account_details).replace(
      RATE_LIMITING_WITHDRAWALS_ACCOUNT,
      account,
    )
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const queryResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      return queryResp as AccountDetails
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
