import { Args, Float, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AndrSearchOptions } from '../types'
import { CW20Service } from './cw20.service'
import { CW20Ado, Minter, TokenInfo } from './types'
import { Allowance, DownloadLogo, MarketingInfo } from './types/cw20.query'

@Resolver(CW20Ado)
export class CW20Resolver {
  constructor(private readonly cw20Service: CW20Service) {}

  @ResolveField(() => String)
  public async chainId(@Parent() token: CW20Ado): Promise<string> {
    return this.cw20Service.getChainId(token.address)
  }

  @ResolveField(() => Float)
  public async balance(@Parent() token: CW20Ado, @Args('address') address: string): Promise<number> {
    return this.cw20Service.balance(token.address, address)
  }

  @ResolveField(() => TokenInfo)
  public async tokenInfo(@Parent() token: CW20Ado): Promise<TokenInfo> {
    return this.cw20Service.tokenInfo(token.address)
  }

  @ResolveField(() => Minter)
  public async minter(@Parent() token: CW20Ado): Promise<Minter> {
    return this.cw20Service.minter(token.address)
  }

  @ResolveField(() => Allowance)
  public async allowance(
    @Parent() token: CW20Ado,
    @Args('owner') owner: string,
    @Args('spender') spender: string,
  ): Promise<Allowance> {
    return this.cw20Service.allowance(token.address, owner, spender)
  }

  @ResolveField(() => [Allowance])
  public async allAllowances(
    @Parent() token: CW20Ado,
    @Args('owner') owner: string,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<Allowance[]> {
    return this.cw20Service.allAllowances(token.address, owner, options)
  }

  @ResolveField(() => [Allowance])
  public async allSpenderAllowances(
    @Parent() token: CW20Ado,
    @Args('spender') spender: string,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<Allowance[]> {
    return this.cw20Service.allSpenderAllowances(token.address, spender, options)
  }

  @ResolveField(() => [String])
  public async allAccounts(
    @Parent() token: CW20Ado,
    @Args('options', { nullable: true }) options: AndrSearchOptions,
  ): Promise<string[]> {
    return this.cw20Service.allAccounts(token.address, options)
  }

  @ResolveField(() => MarketingInfo)
  public async marketingInfo(@Parent() token: CW20Ado): Promise<MarketingInfo> {
    return this.cw20Service.marketingInfo(token.address)
  }

  @ResolveField(() => DownloadLogo)
  public async downloadLogo(@Parent() token: CW20Ado): Promise<DownloadLogo> {
    return this.cw20Service.downloadLogo(token.address)
  }
}
