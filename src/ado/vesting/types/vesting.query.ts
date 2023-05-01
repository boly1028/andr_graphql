import { Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class VestingAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => VestingConfig, { nullable: true })
  config?: Promise<VestingConfig>

  @Field(() => VestingBatchInfo, { nullable: true })
  batch?: Promise<VestingBatchInfo>

  @Field(() => [VestingBatchInfo], { nullable: true })
  batches?: Promise<VestingBatchInfo[]>
}

@ObjectType()
export class VestingConfig {
  @Field(() => GraphQLJSON, { nullable: true })
  recipient?: JSON

  @Field(() => Boolean, { nullable: true })
  is_multi_batch_enabled?: boolean

  @Field(() => String, { nullable: true })
  denom?: string

  @Field(() => GraphQLJSON, { nullable: true })
  unbonding_duration?: JSON
}

@ObjectType()
export class VestingBatchInfo {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  amount?: string

  @Field(() => String, { nullable: true })
  amount_claimed?: string

  @Field(() => String, { nullable: true })
  amount_available_to_claim?: string

  @Field(() => String, { nullable: true })
  number_of_available_claims?: string

  @Field(() => Int, { nullable: true })
  lockup_end?: number

  @Field(() => Int, { nullable: true })
  release_unit?: number

  @Field(() => GraphQLJSON, { nullable: true })
  release_amount?: JSON

  @Field(() => Int, { nullable: true })
  last_claimed_release_time?: number
}
