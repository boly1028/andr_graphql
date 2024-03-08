import { ArgsType, Field, ObjectType } from '@nestjs/graphql'
import { AdoType, AndrQuery } from 'src/ado/andr-query/types'
import { IBaseAdoQuery } from 'src/ado/types'
import { BaseAdoContract } from 'src/ado/types/base-andr.query'

@ObjectType({ implements: IBaseAdoQuery })
export class AppAdo extends BaseAdoContract implements IBaseAdoQuery {
  @Field()
  address!: string

  @Field()
  type!: string

  @Field(() => AndrQuery)
  andr!: AndrQuery

  @Field(() => AppConfig, { nullable: true })
  config?: Promise<AppConfig>

  @Field(() => String, { nullable: true })
  getAddress?: Promise<string>

  @Field(() => String, { nullable: true })
  chainId?: Promise<string>

  @Field(() => [AppComponentAddress], { nullable: true })
  addresses?: Promise<AppComponentAddress[]>

  @Field(() => Boolean, { nullable: true })
  componentExists?: Promise<boolean>

  @Field(() => [AppComponent], { nullable: true })
  components?: Promise<AppComponent[]>
}

@ObjectType()
export class AppComponent {
  @Field()
  name!: string

  @Field()
  ado_type!: string

  @Field({ nullable: true })
  instantiate_msg?: string

  @Field({ nullable: true })
  address?: string

  // @Field(() => [NftInfo], { nullable: true })
  // tokens?: Promise<NftInfo[]>
}

@ObjectType()
export class AppConfig {
  @Field()
  name!: string

  @Field()
  owner!: string
}

@ObjectType()
export class AppComponentAddress {
  @Field()
  name!: string

  @Field()
  address!: string
}

@ArgsType()
export class ComponentFilterArgs {
  @Field(() => AdoType, { nullable: true })
  adoType?: AdoType
}
