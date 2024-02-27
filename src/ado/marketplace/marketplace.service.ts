import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, AndrSearchOptions, CHAIN_ID_NOT_FOUND_ERR, DEFAULT_CATCH_ERR } from '../types'
import {
  MarketplaceSchema,
  MARKETPLACE_QUERY_SALE_ID,
  MARKETPLACE_QUERY_TOKEN_ADDRESS,
  MARKETPLACE_QUERY_TOKEN_ID,
  SaleStateResponse,
  SaleIds,
  SaleInfo,
} from './types'

@Injectable()
export class MarketplaceService extends AdoService {
  constructor(
    @InjectPinoLogger(MarketplaceService.name)
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

  public async latestSaleState(
    contractAddress: string,
    tokenId: string,
    tokenAddress: string,
  ): Promise<SaleStateResponse> {
    try {
      const queryMsgStr = JSON.stringify(MarketplaceSchema.latest_sale_state)
        .replace(MARKETPLACE_QUERY_TOKEN_ID, tokenId)
        .replace(MARKETPLACE_QUERY_TOKEN_ADDRESS, tokenAddress)
      const queryMsg = JSON.parse(queryMsgStr)
      const saleStateResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      return saleStateResp as SaleStateResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async saleState(contractAddress: string, saleId: string): Promise<SaleStateResponse> {
    try {
      const queryMsgStr = JSON.stringify(MarketplaceSchema.sale_state).replace(MARKETPLACE_QUERY_SALE_ID, saleId)
      const queryMsg = JSON.parse(queryMsgStr)
      const saleStateResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      return saleStateResp as SaleStateResponse
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async saleIds(contractAddress: string, tokenId: string, tokenAddress: string): Promise<SaleIds> {
    try {
      const queryMsgStr = JSON.stringify(MarketplaceSchema.sale_ids)
        .replace(MARKETPLACE_QUERY_TOKEN_ID, tokenId)
        .replace(MARKETPLACE_QUERY_TOKEN_ADDRESS, tokenAddress)
      const queryMsg = JSON.parse(queryMsgStr)
      const saleIdsResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      return saleIdsResp as SaleIds
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async saleInfosForAddress(
    contractAddress: string,
    tokenAddress: string,
    options?: AndrSearchOptions,
  ): Promise<SaleInfo[]> {
    try {
      const queryMsgStr = JSON.stringify(MarketplaceSchema.sale_infos_for_address).replace(
        MARKETPLACE_QUERY_TOKEN_ADDRESS,
        tokenAddress,
      )
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.sale_infos_for_address.limit = options?.limit
      if (options?.startAfter) queryMsg.sale_infos_for_address.start_after = options?.startAfter

      const saleInfosResp = await this.wasmService.queryContract(contractAddress, queryMsg)
      return saleInfosResp as SaleInfo[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
