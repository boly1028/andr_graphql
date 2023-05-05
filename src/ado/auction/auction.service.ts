import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { CW721Schema } from '../cw721/types'
import { AndrSearchOptions, DEFAULT_CATCH_ERR, INVALID_QUERY_ERR } from '../types'
import {
  AuctionSchema,
  AUCTION_QUERY_AUCTION_ID,
  AUCTION_QUERY_TOKEN_ADDRESS,
  AUCTION_QUERY_TOKEN_ID,
  SummaryFields,
} from './types'
import { AuctionIDsResponse, AuctionInfosForAddressResponse, AuctionStateResponse, BidsResponse } from './types'

@Injectable()
export class AuctionService extends AdoService {
  constructor(
    @InjectPinoLogger(AuctionService.name)
    protected readonly logger: PinoLogger,

    @Inject(WasmService)
    protected readonly wasmService: WasmService,
  ) {
    super(logger, wasmService)
  }

  public async getLatestAuctionState(
    address: string,
    tokenId: string,
    tokenAddress: string,
  ): Promise<AuctionStateResponse> {
    try {
      const queryMsgStr = JSON.stringify(AuctionSchema.latest_auction_state)
        .replace(AUCTION_QUERY_TOKEN_ID, tokenId)
        .replace(AUCTION_QUERY_TOKEN_ADDRESS, tokenAddress)

      const queryMsg = JSON.parse(queryMsgStr)
      const auctionState = await this.wasmService.queryContract(address, queryMsg)
      return auctionState as AuctionStateResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getAuctionState(address: string, auctionId: number): Promise<AuctionStateResponse> {
    try {
      const queryMsgStr = JSON.stringify(AuctionSchema.auction_state).replace(
        AUCTION_QUERY_AUCTION_ID,
        String(auctionId),
      )

      const queryMsg = JSON.parse(queryMsgStr)
      const auctionState = await this.wasmService.queryContract(address, queryMsg)
      return auctionState as AuctionStateResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getBids(address: string, auctionId: number, options?: AndrSearchOptions): Promise<BidsResponse> {
    try {
      const queryMsgStr = JSON.stringify(AuctionSchema.bids).replace(AUCTION_QUERY_AUCTION_ID, String(auctionId))
      const queryMsg = JSON.parse(queryMsgStr)

      if (options?.limit) queryMsg.bids.limit = options?.limit
      if (options?.startAfter) queryMsg.bids.start_after = Number(options?.startAfter)
      if (options?.orderBy) queryMsg.bids.order_by = options?.orderBy

      const bids = await this.wasmService.queryContract(address, queryMsg)
      return bids as BidsResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getAuctionIDs(address: string, tokenId: string, tokenAddress: string): Promise<AuctionIDsResponse> {
    try {
      const queryMsgStr = JSON.stringify(AuctionSchema.auction_ids)
        .replace(AUCTION_QUERY_TOKEN_ID, tokenId)
        .replace(AUCTION_QUERY_TOKEN_ADDRESS, tokenAddress)

      const queryMsg = JSON.parse(queryMsgStr)
      const auctionState = await this.wasmService.queryContract(address, queryMsg)
      return auctionState as AuctionIDsResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getAuctionInfosForAddress(
    address: string,
    tokenAddress: string,
  ): Promise<AuctionInfosForAddressResponse> {
    try {
      const queryMsgStr = JSON.stringify(AuctionSchema.auction_infos_for_address).replace(
        AUCTION_QUERY_TOKEN_ADDRESS,
        tokenAddress,
      )

      const queryMsg = JSON.parse(queryMsgStr)
      const auctionInfo = await this.wasmService.queryContract(address, queryMsg)
      return auctionInfo as AuctionInfosForAddressResponse
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async getSummaryFields(address: string, tokenAddress: string): Promise<SummaryFields> {
    try {
      const response = await this.wasmService.queryContract(tokenAddress, CW721Schema.all_tokens)

      let floorPrice: number | undefined
      let highestBid: number | undefined
      let coinDenom: string | undefined
      for (const tokenId of response.tokens) {
        const queryMsgStr = JSON.stringify(AuctionSchema.latest_auction_state)
          .replace(AUCTION_QUERY_TOKEN_ID, tokenId)
          .replace(AUCTION_QUERY_TOKEN_ADDRESS, tokenAddress)

        const queryMsg = JSON.parse(queryMsgStr)
        const auctionState: AuctionStateResponse = await this.wasmService.queryContract(address, queryMsg)

        if (auctionState.min_bid) {
          if (floorPrice === undefined) floorPrice = auctionState.min_bid
          if (floorPrice > auctionState.min_bid) floorPrice = auctionState.min_bid
        }
        if (auctionState.high_bidder_amount) {
          if (highestBid === undefined) highestBid = auctionState.high_bidder_amount
          if (highestBid < auctionState.high_bidder_amount) highestBid = auctionState.high_bidder_amount
        }
        if (auctionState.coin_denom) {
          coinDenom = auctionState.coin_denom
        }
      }
      return { min_bid: floorPrice, high_bidder_amount: highestBid, coin_denom: coinDenom } as SummaryFields
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', address)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
