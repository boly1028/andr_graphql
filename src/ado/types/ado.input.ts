import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class AdoInput {
  @Field()
  adoType!: string

  @Field(() => Int)
  instantiateHeight!: number

  @Field()
  instantiateHash!: string

  @Field()
  lastUpdatedHash!: string

  @Field()
  owner!: string

  @Field()
  address!: string

  @Field(() => Int)
  lastUpdatedHeight!: number

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  appContract?: string

  @Field()
  chainId!: string

  @Field({ nullable: true })
  minter?: string
}

@InputType()
export class AdoAddedSubscriptionInput {
  @Field(() => String)
  owner!: string
}

@InputType()
export class UpdateAdoOwnerInput {
  @Field()
  newOwner!: string

  @Field()
  address!: string

  @Field(() => Int)
  txHeight!: number
}

@InputType()
export class AdoOwnerUpdatedSubscriptionInput {
  @Field(() => String)
  owner!: string
}
