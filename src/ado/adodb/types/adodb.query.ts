import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'
import { BaseAdoContract } from 'src/ado/types/base-andr.query'

@ObjectType({ implements: IBaseAdoQuery })
export class AdoDBAdo extends BaseAdoContract implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>

  @Field(() => Boolean, { nullable: true })
  isUnpublishedCodeId?: Promise<boolean>

  @Field(() => String, { nullable: true })
  adoType?: Promise<string>

  @Field(() => [String], { nullable: true })
  allAdoTypes?: Promise<string[]>

  @Field(() => [String], { nullable: true })
  adoVerions?: Promise<string[]>

  @Field(() => AdoMetadataResponse, { nullable: true })
  adoMetadata?: Promise<AdoMetadataResponse>

  @Field(() => ActionFeeResponse, { nullable: true })
  actionFee?: Promise<ActionFeeResponse>

  @Field(() => ActionFeeResponse, { nullable: true })
  actionFeeByCodeId?: Promise<ActionFeeResponse>

  @Field(() => VersionResponse, { nullable: true })
  version?: Promise<VersionResponse>

  @Field(() => String, { nullable: true })
  kernelAddress?: Promise<string>
}

@ObjectType()
export class VersionResponse {
  @Field()
  version!: string
}

@ObjectType()
export class AdoMetadataResponse {
  @Field()
  publisher!: string

  @Field()
  latest_version!: string
}

@ObjectType()
export class ActionFeeResponse {
  @Field()
  action!: string

  @Field()
  asset!: string

  @Field()
  amount!: number

  @Field({ nullable: true })
  receiver?: string
}
