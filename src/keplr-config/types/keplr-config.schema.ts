import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type KeplrConfigDocument = KeplrConfig & Document

@ObjectType()
export class Bip44 {
  @Prop({ required: true })
  @Field(() => Int)
  coinType!: number
}

@ObjectType()
export class Bech32Config {
  @Prop({ required: true })
  @Field()
  bech32PrefixAccAddr!: string

  @Prop({ required: true })
  @Field()
  bech32PrefixAccPub!: string

  @Prop({ required: true })
  @Field()
  bech32PrefixValAddr!: string

  @Prop({ required: true })
  @Field()
  bech32PrefixValPub!: string

  @Prop({ required: true })
  @Field()
  bech32PrefixConsAddr!: string

  @Prop({ required: true })
  @Field()
  bech32PrefixConsPub!: string
}

@ObjectType()
export class Currency {
  @Prop({ required: true })
  @Field({ nullable: true })
  coinDenom!: string

  @Prop({ required: true })
  @Field({ nullable: true })
  coinMinimalDenom!: string

  @Prop({ required: true })
  @Field(() => Int, { nullable: true })
  coinDecimals!: number

  @Prop({ required: true })
  @Field({ nullable: true })
  coinGeckoId!: string
}

@ObjectType()
export class GasPriceStep {
  @Prop({ required: true })
  @Field(() => Float)
  low!: number

  @Prop({ required: true })
  @Field(() => Float)
  average!: number

  @Prop({ required: true })
  @Field(() => Float)
  high!: number
}

@Schema()
@ObjectType()
export class KeplrConfig {
  @Prop({ required: true })
  @Field()
  chainName!: string

  @Prop({ required: true })
  @Field()
  chainId!: string

  @Prop({ required: true })
  @Field()
  rpc!: string

  @Prop({ required: true })
  @Field()
  rest!: string

  @Prop({ required: true })
  @Field(() => Bip44)
  bip44!: Bip44

  @Prop({ required: true })
  @Field(() => Bech32Config)
  bech32Config!: Bech32Config

  @Prop({ required: true })
  @Field(() => [Currency])
  currencies!: Currency[]

  @Prop({ required: true })
  @Field(() => [Currency])
  feeCurrencies!: Currency[]

  @Prop({ required: true })
  @Field(() => Currency)
  stakeCurrency!: Currency

  @Prop({ required: true })
  @Field(() => Int)
  coinType!: number

  @Prop({ required: true })
  @Field(() => GasPriceStep)
  gasPriceStep!: GasPriceStep
}

export const KeplrConfigSchema = SchemaFactory.createForClass(KeplrConfig)
