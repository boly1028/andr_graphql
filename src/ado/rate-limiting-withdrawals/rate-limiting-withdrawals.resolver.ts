import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { RateLimitingWithdrawalsService } from './rate-limiting-withdrawals.service'
import { AccountDetails, CoinAllowance, RateLimitingWithdrawalsAdo } from './types'

@Resolver(RateLimitingWithdrawalsAdo)
export class RateLimitingWithdrawalsResolver {
  constructor(private readonly rateLimitingWithdrawalsService: RateLimitingWithdrawalsService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() rateLimitingWithdrawals: RateLimitingWithdrawalsAdo): Promise<string> {
    return this.rateLimitingWithdrawalsService.getChainId(rateLimitingWithdrawals.address)
  }

  @ResolveField(() => CoinAllowance)
  public async coinAllowanceDetails(
    @Parent() rateLimitingWithdrawals: RateLimitingWithdrawalsAdo,
  ): Promise<CoinAllowance> {
    return this.rateLimitingWithdrawalsService.coinAllowanceDetails(rateLimitingWithdrawals.address)
  }

  @ResolveField(() => AccountDetails)
  public async accountDetails(
    @Parent() rateLimitingWithdrawals: RateLimitingWithdrawalsAdo,
    @Args('account') account: string,
  ): Promise<AccountDetails> {
    return this.rateLimitingWithdrawalsService.accountDetails(rateLimitingWithdrawals.address, account)
  }
}
