import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AndrSearchOptions } from '../types'
import { CW20ExchangeService } from './cw20exchange.service'
import { CW20ExchangeAdo, SaleResponse } from './types'

@Resolver(CW20ExchangeAdo)
export class CW20ExchangeResolver {
  constructor(private readonly cw20ExchangeService: CW20ExchangeService) {}

  @ResolveField(() => String)
  public async chainId(@Parent() token: CW20ExchangeAdo): Promise<string> {
    return this.cw20ExchangeService.getChainId(token.address)
  }

  @ResolveField(() => SaleResponse)
  public async sale(
    @Parent() token: CW20ExchangeAdo,
    @Args('cw20', { nullable: true }) cw20: string,
    @Args('native', { nullable: true }) native: string,
  ): Promise<SaleResponse> {
    return this.cw20ExchangeService.sale(token.address, cw20, native)
  }

  @ResolveField(() => String)
  public async tokenAddress(@Parent() token: CW20ExchangeAdo): Promise<string> {
    return this.cw20ExchangeService.tokenAddress(token.address)
  }

  @ResolveField(() => [String])
  public async saleAssets(
    @Parent() token: CW20ExchangeAdo,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<[string]> {
    return this.cw20ExchangeService.saleAssets(token.address, options)
  }
}
