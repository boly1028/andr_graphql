import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { Coin, IBaseAdoQuery } from 'src/ado/types'
import { BaseAdoContract } from 'src/ado/types/base-andr.query'

@ObjectType({ implements: IBaseAdoQuery })
export class CW721Ado extends BaseAdoContract implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  //FIX: Unknown Variant minter
  @Field(() => String, { nullable: true })
  minter?: Promise<string>

  @Field(() => NftOwnerInfo, { nullable: true })
  ownerOf?: Promise<NftOwnerInfo>

  @Field(() => [NftApproval], { nullable: true })
  allOperators?: Promise<NftApproval[]>

  @Field(() => [NftApproval], { nullable: true })
  approvals?: Promise<NftApproval[]>

  @Field(() => NftApproval, { nullable: true })
  approval?: Promise<NftApproval>

  @Field(() => Int, { nullable: true })
  numTokens?: Promise<number>

  @Field(() => NftInfo, { nullable: true })
  nftInfo?: Promise<NftInfo>

  @Field(() => AllNftInfo, { nullable: true })
  allNftInfo?: Promise<AllNftInfo>

  @Field(() => Boolean, { nullable: true })
  isArchived?: Promise<boolean>

  @Field(() => [String], { nullable: true })
  tokens?: Promise<string[]>

  @Field(() => [String], { nullable: true })
  allTokens?: Promise<string[]>

  @Field(() => [NftInfo], { nullable: true })
  searchTokens?: Promise<NftInfo[]>

  @Field(() => NftContractInfo, { nullable: true })
  contractInfo?: Promise<NftContractInfo>

  @Field(() => Int, { nullable: true })
  numOwners?: Promise<number>
}

@ObjectType()
export class NftApproval {
  @Field({ nullable: true })
  spender?: string

  @Field(() => GraphQLJSON, { nullable: true })
  expires?: JSON
}

@ObjectType()
export class NftApprovedForAll {
  @Field(() => [NftApproval], { nullable: true })
  operators?: Promise<NftApproval[]>
}

@ObjectType()
export class NftOwnerInfo {
  @Field({ nullable: true })
  owner?: string

  @Field(() => [NftApproval], { nullable: true })
  approvals?: Promise<NftApproval[]>
}

@ObjectType()
export class NftContractInfo {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  symbol?: string
}

@ObjectType()
export class NftNumTokens {
  @Field(() => Int, { nullable: true })
  count?: number
}

@ObjectType()
export class MetadataAttribute {
  @Field()
  trait_type!: string
  @Field()
  value!: string
  @Field({ nullable: true })
  display_type?: string
}

@ObjectType()
export class TokenExtension {
  @Field()
  name!: string
  @Field()
  publisher!: string
  @Field({ nullable: true })
  description?: string
  @Field(() => [MetadataAttribute])
  attributes!: MetadataAttribute[]
  @Field()
  image!: string
  @Field({ nullable: true })
  image_data?: string
  @Field({ nullable: true })
  external_url?: string
  @Field({ nullable: true })
  animation_url?: string
  @Field({ nullable: true })
  youtube_url?: string
}

@InputType()
export class SearchAttribute {
  @Field()
  trait_type!: string
  @Field({ nullable: true })
  value?: string
}

@ArgsType()
export class AttributeSearchOptions {
  @Field(() => [SearchAttribute], { nullable: true })
  attributes?: SearchAttribute[]
}

@ObjectType()
export class NftInfo {
  @Field(() => String, { nullable: true })
  token_uri?: string

  @Field(() => TokenExtension, { nullable: true })
  extension?: TokenExtension
}

@ObjectType()
export class AllNftInfo {
  @Field(() => NftOwnerInfo, { nullable: true })
  access?: Promise<NftOwnerInfo>

  @Field(() => NftInfo, { nullable: true })
  info?: Promise<NftInfo>
}

@ObjectType()
export class AgreementAmount {
  @Field(() => Coin, { nullable: true })
  raw?: Coin
}

@ObjectType()
export class Agreement {
  @Field(() => AgreementAmount, { nullable: true })
  amount?: AgreementAmount

  @Field(() => String, { nullable: true })
  purchaser?: string
}

@ObjectType()
export class TransferAgreement {
  @Field(() => String, { nullable: true })
  tokenId?: string

  @Field(() => Agreement, { nullable: true })
  agreement?: Agreement
}
