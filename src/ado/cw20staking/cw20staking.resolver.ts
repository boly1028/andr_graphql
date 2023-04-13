import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrSearchOptions } from '../types'
import { CW20StakingService } from './cw20staking.service'
import { ConfigStructure, CW20StakingAdo, StakerResponse, StateStructure } from './types'

@Resolver(CW20StakingAdo)
export class CW20StakingResolver {
  constructor(private readonly cw20StakingService: CW20StakingService) {}

  @ResolveField(() => ConfigStructure)
  public async config(@Parent() token: CW20StakingAdo): Promise<ConfigStructure> {
    return this.cw20StakingService.config(token.address)
  }

  @ResolveField(() => StateStructure)
  public async state(@Parent() token: CW20StakingAdo): Promise<StateStructure> {
    return this.cw20StakingService.state(token.address)
  }

  @ResolveField(() => StakerResponse)
  public async staker(@Parent() token: CW20StakingAdo, @Args('address') address: string): Promise<StakerResponse> {
    return this.cw20StakingService.staker(token.address, address)
  }

  @ResolveField(() => [StakerResponse])
  public async stakers(
    @Parent() token: CW20StakingAdo,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<StakerResponse[]> {
    return this.cw20StakingService.stakers(token.address, options)
  }

  @ResolveField(() => GraphQLJSON)
  public async timestamp(@Parent() token: CW20StakingAdo): Promise<JSON> {
    return this.cw20StakingService.timestamp(token.address)
  }
}
