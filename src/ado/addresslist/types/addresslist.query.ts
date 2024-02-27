import { Field, ObjectType } from '@nestjs/graphql'
import { AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'
import { BaseAdoContract } from 'src/ado/types/base-andr.query'

@ObjectType({ implements: IBaseAdoQuery })
export class AddressListAdo extends BaseAdoContract implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => AddressListResponse, { nullable: true })
  includesAddress?: Promise<AddressListResponse>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>
}

@ObjectType()
export class AddressListResponse {
  @Field(() => Boolean, { nullable: true })
  included?: boolean
}
