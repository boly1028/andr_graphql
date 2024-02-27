import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { AndrSearchOptions } from '../types'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types/ado.constants'
import {
  CW20Schema,
  TokenInfo,
  CW20_BALANCE_ADDRESS,
  Minter,
  CW20_ALLOWANCE_OWNER,
  CW20_ALLOWANCE_SPENDER,
} from './types'
import { Allowance, DownloadLogo, MarketingInfo } from './types/cw20.query'

@Injectable()
export class CW20Service extends AdoService {
  constructor(
    @InjectPinoLogger(CW20Service.name)
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

  public async balance(contractAddress: string, address: string): Promise<number> {
    try {
      const queryMsgStr = JSON.stringify(CW20Schema.balance).replace(CW20_BALANCE_ADDRESS, address)
      const queryMsg = JSON.parse(queryMsgStr)

      const balance = await this.wasmService.queryContract(contractAddress, queryMsg)

      return (balance.balance ?? 0) as number
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async tokenInfo(contractAddress: string): Promise<TokenInfo> {
    try {
      const tokenInfo = await this.wasmService.queryContract(contractAddress, CW20Schema.token_info)

      return tokenInfo as TokenInfo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async minter(contractAddress: string): Promise<Minter> {
    try {
      const minter = await this.wasmService.queryContract(contractAddress, CW20Schema.minter)

      return minter as Minter
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allowance(contractAddress: string, owner: string, spender: string): Promise<Allowance> {
    try {
      const queryMsgStr = JSON.stringify(CW20Schema.allowance)
        .replace(CW20_ALLOWANCE_OWNER, owner)
        .replace(CW20_ALLOWANCE_SPENDER, spender)
      const queryMsg = JSON.parse(queryMsgStr)

      const allowanceResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      allowanceResp.spender = spender

      return allowanceResp as Allowance
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allAllowances(
    contractAddress: string,
    owner: string,
    options?: AndrSearchOptions,
  ): Promise<Allowance[]> {
    try {
      const queryMsgStr = JSON.stringify(CW20Schema.all_allowances).replace(CW20_ALLOWANCE_OWNER, owner)
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.all_allowances.limit = options?.limit
      if (options?.startAfter) queryMsg.all_allowances.start_after = options?.startAfter

      const allowancesResp = await this.wasmService.queryContract(contractAddress, queryMsg)

      return (allowancesResp.allowances ?? []) as Allowance[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allSpenderAllowances(
    contractAddress: string,
    spender: string,
    options?: AndrSearchOptions,
  ): Promise<Allowance[]> {
    try {
      const queryMsgStr = JSON.stringify(CW20Schema.all_spender_allowances).replace(CW20_ALLOWANCE_SPENDER, spender)
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.all_spender_allowances.limit = options?.limit
      if (options?.startAfter) queryMsg.all_spender_allowances.start_after = options?.startAfter

      const allowancesResp = await this.wasmService.queryContract(contractAddress, queryMsg)

      return (allowancesResp.allowances ?? []) as Allowance[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allAccounts(contractAddress: string, options?: AndrSearchOptions): Promise<string[]> {
    try {
      const queryMsgStr = JSON.stringify(CW20Schema.all_accounts)
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.all_accounts.limit = options?.limit
      if (options?.startAfter) queryMsg.all_accounts.start_after = options?.startAfter

      const allAccountsResp = await this.wasmService.queryContract(contractAddress, queryMsg)

      return (allAccountsResp.accounts ?? []) as string[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async marketingInfo(contractAddress: string): Promise<MarketingInfo> {
    try {
      const marketingInfo = await this.wasmService.queryContract(contractAddress, CW20Schema.marketing_info)

      return marketingInfo as MarketingInfo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async downloadLogo(contractAddress: string): Promise<DownloadLogo> {
    try {
      const downloadLogo = await this.wasmService.queryContract(contractAddress, CW20Schema.download_logo)

      return downloadLogo as DownloadLogo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
