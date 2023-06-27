import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type AdoDocument = Ado & Document

@Schema()
@ObjectType()
export class Ado {
  @Field(() => ID)
  _id!: number

  @Prop({ reruired: true })
  @Field()
  owner!: string

  @Prop({ reruired: true })
  @Field()
  address!: string

  @Prop({ reruired: true })
  @Field()
  adoType!: string

  @Prop()
  @Field(() => Int, { nullable: true })
  instantiateHeight?: number

  @Prop()
  @Field(() => Int, { nullable: true })
  lastUpdatedHeight?: number

  @Prop()
  @Field({ nullable: true })
  instantiateHash?: string

  @Prop()
  @Field({ nullable: true })
  lastUpdatedHash?: string

  @Prop()
  @Field({ nullable: true })
  name?: string

  @Prop()
  @Field({ nullable: true })
  appContract?: string

  @Prop()
  @Field({ nullable: true })
  chainId?: string
}

export const AdoSchema = SchemaFactory.createForClass(Ado)
