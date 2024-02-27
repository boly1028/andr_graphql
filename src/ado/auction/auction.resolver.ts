import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql'
import { AndrSearchOptions } from '../types'
import { AdoType } from '../types/ado.enums'
import { AuctionService } from './auction.service'
import {
  AuctionAdo,
  AuctionIDsResponse,
  AuctionInfosForAddressResponse,
  AuctionStateResponse,
  BidsResponse,
  SummaryFields,
} from './types'

@Resolver(AuctionAdo)
export class AuctionResolver {
  constructor(private readonly auctionService: AuctionService) {}

  @Query(() => AuctionAdo, {
    deprecationReason: 'Moved to `ADO` query resolver, use `auction` field on `ADO` to resolve this query.',
  })
  public async auction(@Args('address') address: string): Promise<AuctionAdo> {
    const ado = await this.auctionService.getAdo<AuctionAdo>(address, AdoType.Auction)
    ado.owner = await this.auctionService.owner(address)
    ado.operators = await this.auctionService.operators(address)
    ado.isOperator = await this.auctionService.isOperator(address, address)
    ado.codeId = ado.andr.codeId
    ado.creator = ado.andr.creator
    ado.admin = ado.andr.admin
    ado.label = ado.andr.label
    ado.ibcPortId = ado.andr.ibcPortId
    ado.queries_expected = ado.andr.queries_expected

    return ado
  }

  @ResolveField(() => String)
  public async chainId(@Parent() auction: AuctionAdo): Promise<string> {
    return this.auctionService.getChainId(auction.address)
  }

  @ResolveField(() => String, {
    deprecationReason: 'Moved to `andr` query resolver, use `owner` field on `andr` to resolve this query.',
  })
  public async owner(@Parent() auction: AuctionAdo): Promise<string> {
    return this.auctionService.owner(auction.address)
  }

  @ResolveField(() => [String], {
    deprecationReason: 'Moved to `andr` query resolver, use `operators` field on `andr` to resolve this query.',
  })
  public async operators(@Parent() auction: AuctionAdo): Promise<string[]> {
    return this.auctionService.operators(auction.address)
  }

  @ResolveField(() => Boolean, {
    deprecationReason: 'Moved to `andr` query resolver, use `isOperator` field on `andr` to resolve this query.',
  })
  public async isOperator(@Parent() auction: AuctionAdo, @Args('address') address: string): Promise<boolean> {
    return this.auctionService.isOperator(auction.address, address)
  }

  @ResolveField(() => AuctionStateResponse)
  public async latestAuctionState(
    @Parent() auction: AuctionAdo,
    @Args('tokenId') tokenId: string,
    @Args('tokenAddress') tokenAddress: string,
  ): Promise<AuctionStateResponse> {
    return this.auctionService.getLatestAuctionState(auction.address, tokenId, tokenAddress)
  }

  @ResolveField(() => AuctionStateResponse)
  public async auctionState(
    @Parent() auction: AuctionAdo,
    @Args('auctionId') auctionId: number,
  ): Promise<AuctionStateResponse> {
    return this.auctionService.getAuctionState(auction.address, auctionId)
  }

  @ResolveField(() => BidsResponse)
  public async bids(
    @Parent() auction: AuctionAdo,
    @Args('auctionId') auctionId: number,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<BidsResponse> {
    return this.auctionService.getBids(auction.address, auctionId, options)
  }

  @ResolveField(() => AuctionIDsResponse)
  public async auctionIDs(
    @Parent() auction: AuctionAdo,
    @Args('tokenId') tokenId: string,
    @Args('tokenAddress') tokenAddress: string,
  ): Promise<AuctionIDsResponse> {
    return this.auctionService.getAuctionIDs(auction.address, tokenId, tokenAddress)
  }

  @ResolveField(() => AuctionInfosForAddressResponse)
  public async auctionInfosForAddress(
    @Parent() auction: AuctionAdo,
    @Args('tokenAddress') tokenAddress: string,
  ): Promise<AuctionInfosForAddressResponse> {
    return this.auctionService.getAuctionInfosForAddress(auction.address, tokenAddress)
  }

  @ResolveField(() => SummaryFields, { nullable: true })
  public async summaryFields(
    @Parent() auction: AuctionAdo,
    @Args('tokenAddress') tokenAddress: string,
  ): Promise<SummaryFields> {
    return this.auctionService.getSummaryFields(auction.address, tokenAddress)
  }
}
