import { Field, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class SplitterAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => Splitter, { nullable: true })
  config?: Promise<Splitter>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class AddressPercent {
  @Field(() => GraphQLJSON, { nullable: true })
  recipient?: JSON

  @Field(() => String, { nullable: true })
  percent?: string
}

@ObjectType()
export class Splitter {
  @Field(() => [AddressPercent], { nullable: true })
  recipients?: AddressPercent[]

  @Field(() => GraphQLJSON, { nullable: true })
  lock?: Promise<JSON>
}
