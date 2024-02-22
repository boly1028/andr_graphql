import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { TxService } from './tx.service'
import { TxFilterParams, TxSearchResult, TxInfo, TxSearchByTagArgs } from './types/tx.result'

@Resolver(TxSearchResult)
export class TxResolver {
  constructor(private readonly txService: TxService) {}

  @Query(() => TxSearchResult)
  public async tx(@Args('chainId') chainId: string): Promise<TxSearchResult> {
    return { chainId } as TxSearchResult
  }

  @ResolveField(() => TxInfo)
  public async byHash(@Parent() txSearch: TxSearchResult, @Args('hash') hash: string): Promise<TxInfo> {
    const txInfo = this.txService.byHash(txSearch.chainId, hash)
    return txInfo
  }

  @ResolveField(() => [TxInfo])
  public async byHeight(@Parent() txSearch: TxSearchResult, @Args('height') height: number): Promise<TxInfo[]> {
    const queryInfo = await this.txService.byHeight(txSearch.chainId, height)
    return queryInfo
  }

  @ResolveField(() => [TxInfo])
  public async byContract(
    @Parent() txSearch: TxSearchResult,
    @Args('address') address: string,
    @Args() filterParams?: TxFilterParams,
  ): Promise<TxInfo[]> {
    const queryInfo = await this.txService.byContract(txSearch.chainId, address, filterParams)
    return queryInfo
  }

  @ResolveField(() => [TxInfo])
  public async byAccount(
    @Parent() txSearch: TxSearchResult,
    @Args('sentFromOrTo') sentFromOrTo: string,
    @Args() filterParams?: TxFilterParams,
  ): Promise<TxInfo[]> {
    const queryInfo = await this.txService.byAccount(txSearch.chainId, sentFromOrTo, filterParams)
    return queryInfo
  }

  @ResolveField(() => [TxInfo])
  public async byOwner(
    @Parent() txSearch: TxSearchResult,
    @Args('walletAddress') walletAddress: string,
    @Args() filterParams?: TxFilterParams,
  ): Promise<TxInfo[]> {
    const queryInfo = await this.txService.byOwner(txSearch.chainId, walletAddress, filterParams)
    return queryInfo
  }

  @ResolveField(() => [TxInfo])
  public async byTag(
    @Parent() txSearch: TxSearchResult,
    @Args() searchTags: TxSearchByTagArgs,
    @Args() filterParams?: TxFilterParams,
  ): Promise<TxInfo[]> {
    const queryInfo = await this.txService.byTag(txSearch.chainId, searchTags, filterParams)
    return queryInfo
  }

  @ResolveField(() => [TxInfo])
  public async byRawString(@Parent() txSearch: TxSearchResult, @Args('query') query: string): Promise<TxInfo[]> {
    const queryInfo = await this.txService.byRawString(txSearch.chainId, query)
    return queryInfo
  }
}
