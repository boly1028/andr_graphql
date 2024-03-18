import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery, Coin } from 'src/ado/types'
import { BaseAdoContract } from 'src/ado/types/base-andr.query'

@ObjectType({ implements: IBaseAdoQuery })
export class KernelAdo extends BaseAdoContract implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>

  @Field(() => String, { nullable: true })
  keyAddress?: Promise<string>

  @Field(() => Boolean, { nullable: true })
  verifyAddress?: Promise<boolean>

  @Field(() => ChannelInfoResponse, { nullable: true })
  channelInfo?: Promise<ChannelInfoResponse>

  @Field(() => [Coin], { nullable: true })
  recoveries?: Promise<Coin[]>
}

@ObjectType()
export class ChannelInfoResponse {
  @Field(() => String, { nullable: true })
  ics20?: string

  @Field(() => String, { nullable: true })
  direct?: string

  @Field(() => String, { nullable: true })
  kernel_address?: string

  @Field(() => [String], { nullable: true })
  supported_modules?: string[]
}
