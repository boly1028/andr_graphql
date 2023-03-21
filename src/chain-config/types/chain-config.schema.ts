import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type ChainConfigDocument = ChainConfig & Document

@ObjectType()
export class IconUrl {
  @Prop({ required: true })
  @Field()
  sm!: string

  @Prop({ required: true })
  @Field()
  lg!: string
}

@Schema()
@ObjectType()
export class ChainConfig {
  @Prop({ required: true })
  @Field()
  name!: string

  @Prop({ required: true })
  @Field()
  chainName!: string

  @Prop({ required: true })
  @Field()
  chainId!: string

  @Prop({ required: true })
  @Field()
  chainUrl!: string

  @Prop({ required: true })
  @Field()
  chainType!: string

  @Prop({ required: true })
  @Field()
  registryAddress!: string

  @Prop({ required: true })
  @Field()
  addressPrefix!: string

  @Prop({ required: true })
  @Field()
  defaultFee!: string

  @Prop({ required: true })
  @Field(() => [String])
  blockExplorerTxPages!: string[]

  @Prop({ required: true })
  @Field(() => [String])
  blockExplorerAddressPages!: string[]

  @Prop({ required: true })
  @Field(() => IconUrl)
  iconUrls!: IconUrl

  @Prop({ required: true })
  @Field({ nullable: true })
  kernelAddress!: string
}

export const ChainConfigSchema = SchemaFactory.createForClass(ChainConfig)
