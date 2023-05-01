import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class RateLimitingWithdrawalsAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => CoinAllowance, { nullable: true })
  coinAllowanceDetails?: Promise<CoinAllowance>

  @Field(() => AccountDetails, { nullable: true })
  accountDetails?: Promise<AccountDetails>
}

@ObjectType()
export class CoinAllowance {
  @Field(() => String, { nullable: true })
  coin?: string

  @Field(() => String, { nullable: true })
  limit?: string

  @Field(() => String, { nullable: true })
  minimal_withdrawal_frequency?: string
}

@ObjectType()
export class AccountDetails {
  @Field(() => String, { nullable: true })
  balance?: string

  @Field(() => String, { nullable: true })
  latest_withdrawal?: string
}
