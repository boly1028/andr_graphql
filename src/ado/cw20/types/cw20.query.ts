import { Field, Int, Float, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class CW20Ado implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => Float, { nullable: true })
  balance?: Promise<number>

  @Field(() => TokenInfo, { nullable: true })
  tokenInfo?: Promise<TokenInfo>

  @Field(() => Minter, { nullable: true })
  minter?: Promise<Minter>

  @Field(() => Allowance, { nullable: true })
  allowance?: Promise<Allowance>

  @Field(() => [Allowance], { nullable: true })
  allAllowances?: Promise<Allowance[]>

  @Field(() => [Allowance], { nullable: true })
  allSpenderAllowances?: Promise<Allowance[]>

  @Field(() => [String], { nullable: true })
  allAccounts?: Promise<string[]>

  @Field(() => MarketingInfo, { nullable: true })
  marketingInfo?: Promise<MarketingInfo>

  @Field(() => DownloadLogo, { nullable: true })
  downloadLogo?: Promise<DownloadLogo>
}

@ObjectType()
export class TokenInfo {
  @Field()
  name!: string

  @Field()
  symbol!: string

  @Field(() => Int)
  decimals!: number

  @Field(() => Float)
  total_supply!: number
}

@ObjectType()
export class Minter {
  @Field()
  minter!: string

  @Field(() => Float, { nullable: true })
  cap?: number
}

@ObjectType()
export class Allowance {
  @Field(() => String, { nullable: true })
  owner?: string

  @Field(() => String, { nullable: true })
  spender?: string

  @Field(() => Float, { nullable: true })
  allowance?: number

  @Field(() => GraphQLJSON, { nullable: true })
  expires?: Promise<JSON>
}

@ObjectType()
export class MarketingInfo {
  @Field(() => String, { nullable: true })
  project?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  marketing?: string

  @Field(() => Float, { nullable: true })
  allowance?: number

  @Field(() => GraphQLJSON, { nullable: true })
  logo?: Promise<JSON>
}

@ObjectType()
export class DownloadLogo {
  @Field(() => String, { nullable: true })
  mime_type?: string

  @Field(() => GraphQLJSON, { nullable: true })
  data?: Promise<JSON>
}
