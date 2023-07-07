import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type AdoDocument = Ado & Document

@Schema()
@ObjectType()
export class Ado {
  @Prop({ required: true })
  @Field()
  adoType!: string

  @Prop({ required: true })
  @Field()
  instantiateHeight!: number

  @Prop({ required: true })
  @Field()
  instantiateHash!: string

  @Prop({ required: true })
  @Field()
  lastUpdatedHash!: string

  @Prop({ required: true })
  @Field()
  owner!: string

  @Prop({ required: true, unique: true })
  @Field()
  address!: string

  @Prop({ required: true })
  @Field()
  lastUpdatedHeight!: number

  @Prop()
  @Field({ nullable: true })
  name?: string

  @Prop()
  @Field({ nullable: true })
  appContract?: string

  @Prop({ required: true })
  @Field()
  chainId!: string

  @Prop()
  @Field({ nullable: true })
  minter?: string
}

export const AdoSchema = SchemaFactory.createForClass(Ado)
