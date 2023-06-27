import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AccountsService } from './accounts.service'
import { AssetFilterArgs, AssetResult } from './assets/types'
import { AccountsQuery } from './types'

@Resolver(AccountsQuery)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => AccountsQuery)
  public async accounts(): Promise<AccountsQuery> {
    return {} as AccountsQuery
  }

  @ResolveField(() => [AssetResult])
  public async assets(
    @Args('walletAddress') walletAddress: string,
    @Args() filter: AssetFilterArgs,
  ): Promise<AssetResult[]> {
    return this.accountsService.getAssets(walletAddress, filter)
  }
}
