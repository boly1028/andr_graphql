import { Field, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type AdoPackageDocument = AdoPackage & Document

@ObjectType()
export class ADOPSchemaReceive {
  @Field({ nullable: true })
  cw721?: string

  @Field({ nullable: true })
  cw20?: string
}

@ObjectType()
export class ADOPSchema {
  @Field({ nullable: true })
  execute?: string

  @Field({ nullable: true })
  instantiate?: string

  @Field({ nullable: true })
  query?: string

  @Field({ nullable: true })
  contract_schema?: string

  @Field(() => ADOPSchemaReceive, { nullable: true })
  receive?: ADOPSchemaReceive
}
@Schema()
@ObjectType()
export class AdoPackage {
  @Prop({ required: true })
  @Field()
  name!: string

  @Prop({ required: true })
  @Field(() => ADOPSchema)
  schemas!: ADOPSchema
}

export const AdoPackageSchema = SchemaFactory.createForClass(AdoPackage)
