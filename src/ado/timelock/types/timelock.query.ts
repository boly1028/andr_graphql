import { Field, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'
import { Coin } from 'src/ado/types/common'

@ObjectType({ implements: IBaseAdoQuery })
export class TimelockAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => Escrow, { nullable: true })
  getLockedFunds?: Promise<Escrow>

  @Field(() => [Escrow], { nullable: true })
  getLockedFundsForRecipient?: Promise<Escrow[]>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class EscrowCondition {
  @Field(() => GraphQLJSON, { nullable: true })
  expiration?: JSON

  @Field(() => [Coin], { nullable: true })
  miniumFunds?: Coin[]
}

@ObjectType()
export class Escrow {
  @Field(() => [Coin], { nullable: true })
  coins?: Coin[]

  @Field(() => EscrowCondition, { nullable: true })
  condition?: EscrowCondition

  @Field(() => GraphQLJSON, { nullable: true })
  recipient?: JSON
}

@ObjectType()
export class LockedFunds {
  @Field(() => Escrow, { nullable: true })
  funds?: Escrow
}
