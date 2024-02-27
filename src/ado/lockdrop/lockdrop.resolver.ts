import { Args, Float, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { LockdropService } from './lockdrop.service'
import { LockdropAdo, LockdropConfig, LockdropState, LockdropUserInfo } from './types'

@Resolver(LockdropAdo)
export class LockdropResolver {
  constructor(private readonly lockdropService: LockdropService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() lockdrop: LockdropAdo): Promise<string> {
    return this.lockdropService.getChainId(lockdrop.address)
  }

  @ResolveField(() => LockdropState)
  public async state(@Parent() lockdrop: LockdropAdo): Promise<LockdropState> {
    return this.lockdropService.state(lockdrop.address)
  }

  @ResolveField(() => LockdropConfig)
  public async config(@Parent() lockdrop: LockdropAdo): Promise<LockdropConfig> {
    return this.lockdropService.config(lockdrop.address)
  }

  @ResolveField(() => [LockdropUserInfo])
  public async userInfo(@Parent() lockdrop: LockdropAdo, @Args('user') user: string): Promise<LockdropUserInfo> {
    return this.lockdropService.userInfo(lockdrop.address, user)
  }

  @ResolveField(() => Float)
  public async withdrawalPercentAllowed(
    @Parent() lockdrop: LockdropAdo,
    @Args('timestamp') timestamp: number,
  ): Promise<number> {
    return this.lockdropService.withdrawalPercentAllowed(lockdrop.address, timestamp)
  }
}
