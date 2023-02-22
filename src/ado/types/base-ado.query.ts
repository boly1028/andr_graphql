import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from '../andr-query/types'
import { IBaseAdoQuery } from './base-ado.interface'

@ObjectType({ implements: IBaseAdoQuery })
export class BaseAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery
}
