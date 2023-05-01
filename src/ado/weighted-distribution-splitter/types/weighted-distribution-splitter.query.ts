import { Field, Float, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { Splitter } from 'src/ado/splitter/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class WeightedDistributionSplitterAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => Splitter, { nullable: true })
  config?: Promise<Splitter>
}

@ObjectType()
export class UserWeightResponse {
  @Field(() => Float, { nullable: true })
  weight?: number

  @Field(() => Float, { nullable: true })
  total_weight?: number
}
