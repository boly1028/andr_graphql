import { Field, InterfaceType } from '@nestjs/graphql'
import { AndrQuery } from '../andr-query/types'

@InterfaceType()
export abstract class IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery, { nullable: true })
  andr!: AndrQuery
}
