import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class MarketplaceAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => SaleStateResponse, { nullable: true })
  latestSaleState?: Promise<SaleStateResponse>

  @Field(() => SaleStateResponse, { nullable: true })
  saleState?: Promise<SaleStateResponse>

  @Field(() => SaleIds, { nullable: true })
  saleIds?: Promise<SaleIds>

  @Field(() => [SaleInfo], { nullable: true })
  saleInfosForAddress?: Promise<SaleInfo[]>
}

@ObjectType()
export class SaleStateResponse {
  @Field({ nullable: true })
  sale_id?: string

  @Field({ nullable: true })
  coin_denom?: string

  @Field({ nullable: true })
  price?: string

  @Field({ nullable: true })
  status?: string
}

@ObjectType()
export class SaleInfo {
  @Field(() => [String], { nullable: true })
  sale_ids?: string[]

  @Field({ nullable: true })
  token_address?: string

  @Field({ nullable: true })
  token_id?: string
}

@ObjectType()
export class SaleIds {
  @Field(() => [String], { nullable: true })
  sale_ids?: string[]
}
