import { Field, Int, ObjectType } from '@nestjs/graphql'
import { IWasmContract } from 'src/wasm/types'

@ObjectType({
  implements: [IWasmContract],
})
export class AndrQuery implements IWasmContract {
  @Field(() => String)
  address!: string

  @Field(() => Int)
  codeId!: number

  @Field(() => String)
  creator!: string

  @Field(() => String, { nullable: true })
  admin?: string

  @Field(() => String)
  label!: string

  @Field(() => String, { nullable: true })
  ibcPortId?: string

  @Field(() => [String], { nullable: true })
  queries_expected?: string[]

  @Field(() => String)
  owner!: Promise<string>

  @Field(() => [String])
  operators!: Promise<string[]>

  @Field(() => Boolean)
  isOperator!: Promise<boolean>

  @Field(() => String)
  type!: string

  @Field(() => Int)
  blockHeightUponCreation!: Promise<number>

  @Field(() => String)
  version!: Promise<string>

  @Field(() => String)
  originalPublisher!: Promise<string>

  @Field(() => String, { nullable: true })
  contractVersion?: string
}
