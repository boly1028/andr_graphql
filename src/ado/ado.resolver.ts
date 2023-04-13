import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AddressListAdo } from './addresslist/types'
import { AdoService } from './ado.service'
import { AdoType } from './andr-query/types'
import { AppAdo } from './app/types'
import { AuctionAdo } from './auction/types'
import { CrowdfundAdo } from './crowdfund/types'
import { CW20Ado } from './cw20/types'
import { CW20ExchangeAdo } from './cw20exchange/types'
import { CW20StakingAdo } from './cw20staking/types'
import { CW721Ado } from './cw721/types'
import { FactoryAdo } from './factory/types'
import { MarketplaceAdo } from './marketplace/types'
import { PrimitiveAdo } from './primitive/types'
import { RatesAdo } from './rates/types'
import { SplitterAdo } from './splitter/types'
import { TimelockAdo } from './timelock/types'
import { AdoQuery } from './types'
import { BaseAdo } from './types/base-ado.query'
import { VaultAdo } from './vault/types'

@Resolver(AdoQuery)
export class AdoResolver {
  constructor(private readonly adoService: AdoService) {}

  @Query(() => AdoQuery)
  public async ADO(): Promise<AdoQuery> {
    return {} as AdoQuery
  }

  @ResolveField(() => BaseAdo)
  public async ado(@Args('address') address: string): Promise<BaseAdo> {
    return this.adoService.getAdo<BaseAdo>(address, AdoType.Ado)
  }

  @ResolveField(() => AddressListAdo)
  public async address_list(@Args('address') address: string): Promise<AddressListAdo> {
    return this.adoService.getAdo<AddressListAdo>(address, AdoType.AddressList)
  }

  @ResolveField(() => AppAdo)
  public async app(@Args('address') address: string): Promise<AppAdo> {
    return this.adoService.getAdo<AppAdo>(address, AdoType.App)
  }

  @ResolveField(() => AuctionAdo)
  public async auction(@Args('address') address: string): Promise<AuctionAdo> {
    return this.adoService.getAdo<AuctionAdo>(address, AdoType.Auction)
  }

  @ResolveField(() => CrowdfundAdo)
  public async crowdfund(@Args('address') address: string): Promise<CrowdfundAdo> {
    return this.adoService.getAdo<CrowdfundAdo>(address, AdoType.Crowdfund)
  }

  @ResolveField(() => CW20Ado)
  public async cw20(@Args('address') address: string): Promise<CW20Ado> {
    return this.adoService.getAdo<CW20Ado>(address, AdoType.CW20)
  }

  @ResolveField(() => CW20StakingAdo)
  public async cw20_staking(@Args('address') address: string): Promise<CW20StakingAdo> {
    return this.adoService.getAdo<CW20StakingAdo>(address, AdoType.CW20Staking)
  }

  @ResolveField(() => CW20ExchangeAdo)
  public async cw20_exchange(@Args('address') address: string): Promise<CW20ExchangeAdo> {
    return this.adoService.getAdo<CW20ExchangeAdo>(address, AdoType.CW20Exchange)
  }

  @ResolveField(() => CW721Ado)
  public async cw721(@Args('address') address: string): Promise<CW721Ado> {
    return this.adoService.getAdo<CW721Ado>(address, AdoType.CW721)
  }

  @ResolveField(() => FactoryAdo)
  public async factory(@Args('address') address: string): Promise<FactoryAdo> {
    return this.adoService.getAdo<FactoryAdo>(address, AdoType.Factory)
  }

  @ResolveField(() => MarketplaceAdo)
  public async marketplace(@Args('address') address: string): Promise<MarketplaceAdo> {
    return this.adoService.getAdo<MarketplaceAdo>(address, AdoType.Marketplace)
  }

  @ResolveField(() => PrimitiveAdo)
  public async primitive(@Args('address') address: string): Promise<PrimitiveAdo> {
    return this.adoService.getAdo<PrimitiveAdo>(address, AdoType.Primitive)
  }

  @ResolveField(() => RatesAdo)
  public async rates(@Args('address') address: string): Promise<RatesAdo> {
    return this.adoService.getAdo<RatesAdo>(address, AdoType.Rates)
  }

  @ResolveField(() => SplitterAdo)
  public async splitter(@Args('address') address: string): Promise<SplitterAdo> {
    return this.adoService.getAdo<SplitterAdo>(address, AdoType.Splitter)
  }

  @ResolveField(() => TimelockAdo)
  public async timelock(@Args('address') address: string): Promise<TimelockAdo> {
    return this.adoService.getAdo<TimelockAdo>(address, AdoType.Timelock)
  }

  @ResolveField(() => VaultAdo)
  public async vault(@Args('address') address: string): Promise<VaultAdo> {
    return this.adoService.getAdo<VaultAdo>(address, AdoType.Vault)
  }
}
