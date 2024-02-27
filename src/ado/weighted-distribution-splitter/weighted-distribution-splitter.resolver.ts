import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Splitter } from '../splitter/types'
import { UserWeightResponse, WeightedDistributionSplitterAdo } from './types'
import { WeightedDistributionSplitterService } from './weighted-distribution-splitter.service'

@Resolver(WeightedDistributionSplitterAdo)
export class WeightedDistributionSplitterResolver {
  constructor(private readonly wDSplitterService: WeightedDistributionSplitterService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() wDSplitter: WeightedDistributionSplitterAdo): Promise<string> {
    return this.wDSplitterService.getChainId(wDSplitter.address)
  }

  @ResolveField(() => Splitter)
  public async config(@Parent() wDSplitter: WeightedDistributionSplitterAdo): Promise<Splitter> {
    return this.wDSplitterService.config(wDSplitter.address)
  }

  @ResolveField(() => UserWeightResponse)
  public async getUserWeight(
    @Parent() wDSplitter: WeightedDistributionSplitterAdo,
    @Args('user') user: string,
  ): Promise<UserWeightResponse> {
    return this.wDSplitterService.getUserWeight(wDSplitter.address, user)
  }
}
