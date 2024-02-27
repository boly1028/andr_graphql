import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Escrow, TimelockAdo } from '../timelock/types'
import { AndrSearchOptions } from '../types/ado.search'
import { TimelockService } from './timelock.service'

@Resolver(TimelockAdo)
export class TimelockResolver {
  constructor(private readonly timelockService: TimelockService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() timelock: TimelockAdo): Promise<string> {
    return this.timelockService.getChainId(timelock.address)
  }

  @ResolveField(() => Escrow)
  public async getLockedFunds(
    @Parent() timelock: TimelockAdo,
    @Args('owner') owner: string,
    @Args('recipient') recipient: string,
  ): Promise<Escrow> {
    return this.timelockService.getLockedFunds(timelock.address, owner, recipient)
  }

  @ResolveField(() => [Escrow])
  public async getLockedFundsForRecipient(
    @Parent() timelock: TimelockAdo,
    @Args('recipient') recipient: string,
    @Args('options') options?: AndrSearchOptions,
  ): Promise<Escrow[]> {
    return this.timelockService.getLockedFundsForRecipient(timelock.address, recipient, options)
  }
}
