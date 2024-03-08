import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@ArgsType()
export class TxSearchArgs {
  @Field(() => Int, { nullable: true })
  height?: number

  @Field({ nullable: true })
  sentFromOrTo?: string

  @Field({ nullable: true })
  contractAddress?: string
}

@ArgsType()
export class TxFilterParams {
  @Field(() => Int, { nullable: true })
  minHeight?: number

  @Field(() => Int, { nullable: true })
  maxHeight?: number
}

@ArgsType()
export class TxSearchByTagArgs {
  @Field(() => GraphQLJSON)
  tags!: Array<{
    readonly key: string
    readonly value: string
  }>
}

@ObjectType()
export class TxInfo {
  @Field(() => Int)
  height!: number

  @Field(() => Int, { nullable: true })
  txIndex?: number

  @Field()
  hash!: string

  @Field(() => Int, { nullable: true })
  code?: number

  @Field({ nullable: true })
  rawLog?: string

  @Field(() => [TxLog], { nullable: true })
  txLog?: TxLog[]

  @Field(() => [TxEvent], { nullable: true })
  events?: TxEvent[]

  @Field(() => GraphQLJSON, { nullable: true })
  tx?: Uint8Array

  @Field(() => Int, { nullable: true })
  gasUsed?: number

  @Field(() => Int, { nullable: true })
  gasWanted?: number

  @Field(() => [TxMsgResponses], { nullable: true })
  msgResponses?: TxMsgResponses[]
}

@ObjectType()
export class TxMsgResponses {
  @Field()
  typeUrl!: string
  @Field(() => GraphQLJSON, { nullable: true })
  value!: Uint8Array
}

@ObjectType()
export class TxLog {
  @Field(() => [TxEvent])
  events!: TxEvent[]
}

@ObjectType()
export class TxEvent {
  @Field()
  type!: string

  @Field(() => [TxEventAttribute])
  attributes!: TxEventAttribute[]
}

@ObjectType()
export class TxEventAttribute {
  @Field()
  key!: string

  @Field()
  value!: string
}

@ObjectType()
export class TxSearchResult {
  @Field()
  chainId!: string

  @Field(() => TxInfo, { nullable: true })
  byHash?: TxInfo

  @Field(() => [TxInfo], { nullable: true })
  byHeight?: TxInfo[]

  @Field(() => [TxInfo], { nullable: true })
  byContract?: TxInfo[]

  @Field(() => [TxInfo], { nullable: true })
  byAccount?: TxInfo[]

  @Field(() => [TxInfo], { nullable: true })
  byOwner?: TxInfo[]

  @Field(() => [TxInfo], { nullable: true })
  byTag?: TxInfo[]

  @Field(() => [TxInfo], { nullable: true })
  byRawString?: TxInfo[]
}
