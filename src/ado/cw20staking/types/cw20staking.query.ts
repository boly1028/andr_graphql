import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class CW20StakingAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => ConfigStructure, { nullable: true })
  config?: Promise<ConfigStructure>

  @Field(() => StateStructure, { nullable: true })
  state?: Promise<StateStructure>

  @Field(() => StakerResponse, { nullable: true })
  staker?: Promise<StakerResponse>

  @Field(() => [StakerResponse], { nullable: true })
  stakers?: Promise<StakerResponse[]>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class ConfigStructure {
  @Field(() => AndrAddress, { nullable: true })
  staking_token?: Promise<AndrAddress>

  @Field(() => Int, { nullable: true })
  number_of_reward_tokens?: number
}

@ObjectType()
export class AndrAddress {
  @Field()
  identifier?: string
}

@ObjectType()
export class StateStructure {
  @Field(() => Float, { nullable: true })
  total_share?: number
}

@ObjectType()
export class StakerResponse {
  @Field()
  address?: string

  @Field(() => Float, { nullable: true })
  share?: number

  @Field(() => [[String, Float]], { nullable: true })
  pending_rewards?: [string, number][]
}
