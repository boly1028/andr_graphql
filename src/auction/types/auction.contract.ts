import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AdoContract, AdoContractError } from '../../ado/types/ado.contract'
import { AdoType } from '../../ado/types/ado.enums'

@ObjectType()
export class AuctionContract extends AdoContract {
  //{ token_id: String, token_address: String }
  @Field(() => AuctionStateResponse, { nullable: true })
  latestAuctionState?: Promise<AuctionStateResponse>

  //{ token_id: String, token_address: String }
  @Field(() => AuctionIDsResponse, { nullable: true })
  auctionIDs?: Promise<AuctionIDsResponse>

  // { auction_id: Uint128 }
  @Field(() => AuctionStateResponse, { nullable: true })
  auctionState?: Promise<AuctionStateResponse>

  // { auction_id: Uint128 }
  @Field(() => BidsResponse, { nullable: true })
  bids?: Promise<BidsResponse>

  //{ token_address: String }
  @Field(() => AuctionInfosForAddressResponse, { nullable: true })
  auctionInfosForAddress?: Promise<AuctionInfosForAddressResponse>
}

@ObjectType()
export class AuctionStateResponse {
  @Field(() => GraphQLJSON, { nullable: true })
  start_time?: JSON

  @Field(() => GraphQLJSON, { nullable: true })
  end_time?: JSON

  @Field({ nullable: true })
  high_bidder_addr?: string

  @Field(() => Int, { nullable: true })
  high_bidder_amount?: number

  @Field(() => Int, { nullable: true })
  auction_id?: number

  @Field({ nullable: true })
  coin_denom?: string

  @Field(() => Boolean, { nullable: true })
  is_cancelled?: boolean

  @Field(() => Int, { nullable: true })
  min_bid?: number

  @Field(() => GraphQLJSON, { nullable: true })
  whitelist?: JSON
}

@ObjectType()
export class AuctionIDsResponse {
  @Field(() => [Int], { nullable: true })
  auction_ids?: number[]
}

@ObjectType()
export class AuctionInfosForAddressResponse {
  @Field(() => [Int], { nullable: true })
  auction_ids?: number[]

  @Field({ nullable: true })
  token_address?: string

  @Field({ nullable: true })
  token_id?: string
}

@ObjectType()
export class BidsResponse {
  @Field(() => [Bid], { nullable: true })
  bids?: Bid[]
}

@ObjectType()
export class Bid {
  @Field()
  bidder!: string

  @Field(() => Int)
  amount!: number

  @Field(() => GraphQLJSON)
  timestamp!: JSON
}

export const AuctionResult = createUnionType({
  name: 'AuctionResult',
  types: () => [AuctionContract, AdoContractError] as const,
  resolveType: (contract) => {
    if (contract.adoType == AdoType.Auction) {
      return AuctionContract
    }

    return AdoContractError
  },
})
