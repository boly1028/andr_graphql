import { Field, ObjectType } from '@nestjs/graphql'
import { AddressListAdo } from '../addresslist/types'
import { AppAdo } from '../app/types'
import { AuctionAdo } from '../auction/types'
import { CrowdfundAdo } from '../crowdfund/types'
import { CW20Ado } from '../cw20/types'
import { CW20ExchangeAdo } from '../cw20exchange/types'
import { CW20StakingAdo } from '../cw20staking/types'
import { CW721Ado } from '../cw721/types'
import { MarketplaceAdo } from '../marketplace/types'
import { PrimitiveAdo } from '../primitive/types'
import { RatesAdo } from '../rates/types'
import { SplitterAdo } from '../splitter/types'
import { VaultAdo } from '../vault/types'
import { BaseAdo } from './base-ado.query'

@ObjectType()
export class AdoQuery {
  @Field(() => BaseAdo)
  ado!: Promise<BaseAdo>

  @Field(() => PrimitiveAdo)
  primitive!: Promise<PrimitiveAdo>

  @Field(() => CW721Ado)
  cw721!: Promise<CW721Ado>

  @Field(() => SplitterAdo)
  splitter!: Promise<SplitterAdo>

  @Field(() => VaultAdo)
  vault!: Promise<VaultAdo>

  @Field(() => RatesAdo)
  rates!: Promise<RatesAdo>

  @Field(() => AddressListAdo)
  address_list!: Promise<AddressListAdo>

  @Field()
  receipt!: string

  @Field(() => CW20Ado)
  cw20!: Promise<CW20Ado>

  @Field(() => CW20StakingAdo)
  cw20_staking!: Promise<CW20StakingAdo>

  @Field(() => CW20ExchangeAdo)
  cw20_exchange!: Promise<CW20ExchangeAdo>

  @Field(() => AuctionAdo)
  auction!: Promise<AuctionAdo>

  @Field(() => MarketplaceAdo)
  marketplace!: Promise<MarketplaceAdo>

  @Field(() => CrowdfundAdo)
  crowdfund!: Promise<CrowdfundAdo>

  @Field(() => AppAdo)
  app!: Promise<AppAdo>
}
