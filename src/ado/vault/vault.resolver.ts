import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Coin } from 'src/ado/types/common'
import { VaultAdo, AndrStrategy } from './types'
import { VaultService } from './vault.service'

@Resolver(VaultAdo)
export class VaultResolver {
  constructor(private readonly vaultService: VaultService) {}

  @ResolveField(() => [Coin])
  public async balance(@Parent() vault: VaultAdo, @Args('address') address: string): Promise<Coin[]> {
    return this.vaultService.balance(vault.address, address)
  }

  //FIX Invalid Strategy (anchor)
  @ResolveField(() => AndrStrategy)
  public async strategyAddress(@Parent() vault: VaultAdo, @Args('strategy') strategy: string): Promise<AndrStrategy> {
    return this.vaultService.strategyAddress(vault.address, strategy)
  }

  @ResolveField(() => String)
  public async chainId(@Parent() vault: VaultAdo): Promise<string> {
    return this.vaultService.getChainId(vault.address)
  }
}
