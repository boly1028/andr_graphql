import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { AndrSearchOptions } from '../types'
import { INVALID_QUERY_ERR, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types/ado.constants'
import { ASSET_INFO_NOT_FOUND_ERR, CW20ExchangeSchema, SaleResponse } from './types'

@Injectable()
export class CW20ExchangeService extends AdoService {
  constructor(
    @InjectPinoLogger(CW20ExchangeService.name)
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

  public async sale(contractAddress: string, cw20?: string, native?: string): Promise<SaleResponse> {
    try {
      const queryMsgStr = JSON.stringify(CW20ExchangeSchema.sale)
      const queryMsg = JSON.parse(queryMsgStr)

      if (cw20) {
        queryMsg.sale.asset.cw20 = cw20
      } else if (native) {
        queryMsg.sale.asset.native = native
      } else {
        throw new UserInputError(ASSET_INFO_NOT_FOUND_ERR)
      }

      const saleResp = await this.wasmService.queryContract(contractAddress, queryMsg)

      return (saleResp.sale ?? null) as SaleResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async tokenAddress(contractAddress: string): Promise<string> {
    try {
      const tokenResp = await this.wasmService.queryContract(contractAddress, CW20ExchangeSchema.token_address)

      return (tokenResp.address ?? '') as string
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async saleAssets(contractAddress: string, options?: AndrSearchOptions): Promise<[string]> {
    try {
      const queryMsgStr = JSON.stringify(CW20ExchangeSchema.sale_assets)
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.sale_assets.limit = options?.limit
      if (options?.startAfter) queryMsg.sale_assets.start_after = options?.startAfter

      const tokenResp = await this.wasmService.queryContract(contractAddress, queryMsg)

      return (tokenResp.assets ?? ['']) as [string]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
