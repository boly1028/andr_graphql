import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class PrimitiveAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => PrimitiveResponse, { nullable: true })
  getValue?: Promise<PrimitiveResponse>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class PrimitiveResponse {
  @Field(() => String, { nullable: true })
  key?: string

  @Field(() => GraphQLJSON, { nullable: true })
  value?: JSON
}
