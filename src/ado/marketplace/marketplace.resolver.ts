import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AndrSearchOptions } from '../types'
import { MarketplaceService } from './marketplace.service'
import { MarketplaceAdo, SaleIds, SaleInfo, SaleStateResponse } from './types'

@Resolver(MarketplaceAdo)
export class MarketplaceResolver {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() marketplace: MarketplaceAdo): Promise<string> {
    return this.marketplaceService.getChainId(marketplace.address)
  }

  @ResolveField(() => SaleStateResponse)
  public async latestSaleState(
    @Parent() marketplace: MarketplaceAdo,
    @Args('tokenId') tokenId: string,
    @Args('tokenAddress') tokenAddress: string,
  ): Promise<SaleStateResponse> {
    return this.marketplaceService.latestSaleState(marketplace.address, tokenId, tokenAddress)
  }

  @ResolveField(() => SaleStateResponse)
  public async saleState(
    @Parent() marketplace: MarketplaceAdo,
    @Args('saleId') saleId: string,
  ): Promise<SaleStateResponse> {
    return this.marketplaceService.saleState(marketplace.address, saleId)
  }

  @ResolveField(() => SaleStateResponse)
  public async saleIds(
    @Parent() marketplace: MarketplaceAdo,
    @Args('tokenId') tokenId: string,
    @Args('tokenAddress') tokenAddress: string,
  ): Promise<SaleIds> {
    return this.marketplaceService.saleIds(marketplace.address, tokenId, tokenAddress)
  }

  @ResolveField(() => [SaleInfo])
  public async saleInfosForAddress(
    @Parent() marketplace: MarketplaceAdo,
    @Args('tokenAddress') tokenAddress: string,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<SaleInfo[]> {
    return this.marketplaceService.saleInfosForAddress(marketplace.address, tokenAddress, options)
  }
}
