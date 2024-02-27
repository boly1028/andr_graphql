import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery, AndrStrategyType } from 'src/ado/andr-query/types'
import { Coin } from 'src/ado/types'
import { IBaseAdoQuery } from 'src/ado/types'

@ObjectType({ implements: IBaseAdoQuery })
export class VaultAdo implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => [Coin], { nullable: true })
  balance?: Promise<Coin[]>

  @Field(() => AndrStrategy, { nullable: true })
  strategyAddress?: Promise<AndrStrategy>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class AndrStrategy {
  @Field(() => AndrStrategyType, { nullable: true })
  strategyType?: string

  @Field({ nullable: true })
  address?: string
}
