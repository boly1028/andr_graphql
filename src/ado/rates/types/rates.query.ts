import { Field, Float, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { Coin } from 'src/ado/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class RatesAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => [RateInfo], { nullable: true })
  payments?: Promise<RateInfo[]>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class PercentRate {
  @Field(() => Float, { nullable: true })
  decimal?: number
}

@ObjectType()
export class ADORate {
  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  key?: string
}

@ObjectType()
export class Rate {
  @Field(() => Coin, { nullable: true })
  flat?: Coin

  @Field(() => PercentRate, { nullable: true })
  percent?: PercentRate

  @Field(() => ADORate, { nullable: true })
  external?: ADORate
}

@ObjectType()
export class RateInfo {
  @Field(() => Rate, { nullable: true })
  rate?: Rate

  @Field(() => Boolean, { nullable: true })
  is_additive?: boolean

  @Field({ nullable: true })
  description?: string

  @Field(() => [GraphQLJSON], { nullable: true })
  receivers?: JSON[]
}
