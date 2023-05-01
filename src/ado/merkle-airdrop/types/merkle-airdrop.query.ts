import { Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class MerkleAirdropAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => MerkleAirdropConfig, { nullable: true })
  config?: Promise<MerkleAirdropConfig>

  @Field(() => MerkleRootResponse, { nullable: true })
  merkleRoot?: Promise<MerkleRootResponse>

  @Field(() => Int, { nullable: true })
  latestStage?: Promise<number>

  @Field(() => Boolean, { nullable: true })
  isClaimed?: Promise<boolean>

  @Field(() => String, { nullable: true })
  totalClaimed?: Promise<string>
}

@ObjectType()
export class MerkleAirdropConfig {
  @Field(() => GraphQLJSON, { nullable: true })
  asset_info?: JSON
}

@ObjectType()
export class MerkleRootResponse {
  @Field(() => Int, { nullable: true })
  stage?: number

  @Field(() => String, { nullable: true })
  merkle_root?: string

  @Field(() => GraphQLJSON, { nullable: true })
  expiration?: JSON

  @Field(() => String, { nullable: true })
  total_amount?: string
}
