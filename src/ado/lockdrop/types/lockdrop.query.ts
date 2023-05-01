import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class LockdropAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => LockdropState, { nullable: true })
  state?: Promise<LockdropState>

  @Field(() => LockdropConfig, { nullable: true })
  config?: Promise<LockdropConfig>

  @Field(() => [LockdropUserInfo], { nullable: true })
  userInfo?: Promise<LockdropUserInfo>

  @Field(() => Float, { nullable: true })
  withdrawalPercentAllowed?: Promise<number>
}

@ObjectType()
export class LockdropState {
  @Field(() => String, { nullable: true })
  total_native_locked?: string

  @Field(() => Boolean, { nullable: true })
  are_claims_allowed?: boolean
}

@ObjectType()
export class LockdropConfig {
  @Field(() => Int, { nullable: true })
  init_timestamp?: number

  @Field(() => Int, { nullable: true })
  deposit_window?: number

  @Field(() => Int, { nullable: true })
  withdrawal_window?: number

  @Field(() => Int, { nullable: true })
  lockdrop_incentives?: number

  @Field(() => String, { nullable: true })
  incentive_token?: string

  @Field(() => String, { nullable: true })
  native_denom?: string
}

@ObjectType()
export class LockdropUserInfo {
  @Field(() => String, { nullable: true })
  total_native_locked?: string

  @Field(() => String, { nullable: true })
  total_incentives?: string

  @Field(() => Boolean, { nullable: true })
  is_lockdrop_claimed?: boolean

  @Field(() => Boolean, { nullable: true })
  withrawal_flag?: boolean
}
