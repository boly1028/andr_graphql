import { Field, Float, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class CW20ExchangeAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => SaleResponse, { nullable: true })
  sale?: Promise<SaleResponse>

  @Field(() => String, { nullable: true })
  tokenAddress?: Promise<string>
}

@ObjectType()
export class SaleResponse {
  @Field(() => Float, { nullable: true })
  exchange_rate?: number

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => String, { nullable: true })
  recipient?: string
}
