import { Field, ObjectType } from '@nestjs/graphql'
import { AddressListAdo } from '../addresslist/types'
import { AuctionAdo } from '../auction/types'
// import { BaseAdo } from '../ado/types'
// import { AppAdo } from '../app/types'
// import { AuctionAdo } from '../auction/types'
import { CrowdfundAdo } from '../crowdfund/types'
// import { CW20Ado } from '../cw20/types'
import { CW721Ado } from '../cw721/types'
// import { PrimitiveAdo } from '../primitive/types'
// import { RatesAdo } from '../rates/types'
// import { SplitterAdo } from '../splitter/types'
// import { VaultAdo } from '../vault/types'
//import { WasmContract } from '../wasm/types/wasm.contract'

@ObjectType()
export class AdoQuery {
  // @Field(() => PrimitiveAdo)
  // primitive!: Promise<PrimitiveAdo>

  @Field(() => CW721Ado)
  cw721!: Promise<CW721Ado>

  // @Field(() => SplitterAdo)
  // splitter!: Promise<SplitterAdo>

  // @Field(() => VaultAdo)
  // vault!: Promise<VaultAdo>

  // @Field(() => RatesAdo)
  // rates!: Promise<RatesAdo>

  @Field(() => AddressListAdo)
  address_list!: Promise<AddressListAdo>

  // @Field()
  // receipt!: string

  // @Field(() => CW20Ado)
  // cw20!: Promise<CW20Ado>

  // @Field()
  // cw20_staking!: string

  @Field(() => AuctionAdo)
  auction!: Promise<AuctionAdo>

  // @Field()
  // marketplace!: string

  @Field(() => CrowdfundAdo)
  crowdfund!: Promise<CrowdfundAdo>

  // @Field(() => AppAdo)
  // app!: Promise<AppAdo>

  // @Field(() => BaseAdo)
  // ado!: Promise<BaseAdo>

  // @Field(() => WasmContract)
  // wasm!: Promise<WasmContract>
}
