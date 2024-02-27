import { Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'
import { Coin } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class CrowdfundAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => CrowdfundState, { nullable: true })
  state?: Promise<CrowdfundState>

  @Field(() => CrowdfundConfig, { nullable: true })
  config?: Promise<CrowdfundConfig>

  @Field(() => [String], { nullable: true })
  availableTokens?: Promise<string[]>

  @Field(() => Boolean, { nullable: true })
  isTokenAvailable?: Promise<boolean>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class CrowdfundState {
  @Field(() => GraphQLJSON, { nullable: true })
  expiration?: Promise<JSON>

  @Field(() => Coin, { nullable: true })
  price?: Promise<Coin>

  @Field(() => Int, { nullable: true })
  min_tokens_sold?: Promise<number>

  @Field(() => Int, { nullable: true })
  max_amount_per_wallet?: Promise<number>

  @Field(() => Int, { nullable: true })
  amount_sold?: Promise<number>

  @Field(() => Int, { nullable: true })
  amount_to_send?: Promise<number>

  @Field(() => Int, { nullable: true })
  amount_transferred?: Promise<number>

  @Field(() => GraphQLJSON, { nullable: true })
  recipient?: Promise<JSON>
}

@ObjectType()
export class CrowdfundConfig {
  @Field(() => GraphQLJSON)
  token_address!: Promise<JSON>

  @Field(() => Boolean)
  can_mint_after_sale!: Promise<boolean>
}
