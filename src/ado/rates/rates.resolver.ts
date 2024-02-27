import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { RatesService } from './rates.service'
import { RateInfo, RatesAdo } from './types'

@Resolver(RatesAdo)
export class RatesResolver {
  constructor(private readonly ratesService: RatesService) {}

  @ResolveField(() => [RateInfo])
  public async payments(@Parent() rates: RatesAdo): Promise<RateInfo[]> {
    return this.ratesService.payments(rates.address)
  }

  @ResolveField(() => String)
  public async chainId(@Parent() rates: RatesAdo): Promise<string> {
    return this.ratesService.getChainId(rates.address)
  }
}
