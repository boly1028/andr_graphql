import { Args, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { AndrQueryService } from './andr-query.service'
import { AndrQuery } from './types/andr.query'

@Resolver(AndrQuery)
export class AndrQueryResolver {
  constructor(private readonly andrQueryService: AndrQueryService) {}

  @ResolveField(() => String)
  public async owner(@Parent() andr: AndrQuery): Promise<string> {
    return this.andrQueryService.owner(andr.address, andr?.contractVersion)
  }

  @ResolveField(() => [String])
  public async operators(@Parent() andr: AndrQuery): Promise<string[]> {
    return this.andrQueryService.operators(andr.address, andr?.contractVersion)
  }

  @ResolveField(() => Boolean)
  public async isOperator(@Parent() andr: AndrQuery, @Args('address') address: string): Promise<boolean> {
    return this.andrQueryService.isOperator(andr.address, address, andr?.contractVersion)
  }

  @ResolveField(() => String)
  public async type(@Parent() andr: AndrQuery): Promise<string> {
    return this.andrQueryService.type(andr.address, andr?.contractVersion)
  }

  @ResolveField(() => Int)
  public async blockHeightUponCreation(@Parent() andr: AndrQuery): Promise<number> {
    return this.andrQueryService.blockHeightUponCreation(andr.address, andr?.contractVersion)
  }

  @ResolveField(() => String)
  public async version(@Parent() andr: AndrQuery): Promise<string> {
    return this.andrQueryService.version(andr.address, andr?.contractVersion)
  }

  @ResolveField(() => String)
  public async originalPublisher(@Parent() andr: AndrQuery): Promise<string> {
    return this.andrQueryService.originalPublisher(andr.address, andr?.contractVersion)
  }
}
