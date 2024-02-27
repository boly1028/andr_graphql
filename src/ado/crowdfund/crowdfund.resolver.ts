import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { CrowdfundService } from './crowdfund.service'
import { CrowdfundAdo, CrowdfundConfig, CrowdfundState } from './types'

@Resolver(CrowdfundAdo)
export class CrowdfundResolver {
  constructor(private readonly crowdfundService: CrowdfundService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() crowdfund: CrowdfundAdo): Promise<string> {
    return this.crowdfundService.getChainId(crowdfund.address)
  }

  @ResolveField(() => CrowdfundState)
  public async state(@Parent() crowdfund: CrowdfundAdo): Promise<CrowdfundState> {
    return this.crowdfundService.state(crowdfund.address)
  }

  @ResolveField(() => CrowdfundConfig)
  public async config(@Parent() crowdfund: CrowdfundAdo): Promise<CrowdfundConfig> {
    return this.crowdfundService.config(crowdfund.address)
  }

  @ResolveField(() => [String])
  public async availableTokens(@Parent() crowdfund: CrowdfundAdo): Promise<string[]> {
    return this.crowdfundService.availableTokens(crowdfund.address)
  }

  @ResolveField(() => Boolean)
  public async isTokenAvailable(@Parent() crowdfund: CrowdfundAdo, @Args('tokenId') tokenId: string): Promise<boolean> {
    return this.crowdfundService.isTokenAvailable(crowdfund.address, tokenId)
  }
}
