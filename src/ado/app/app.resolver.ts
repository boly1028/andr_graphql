import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { AdoType } from '../types'
import { AppService } from './app.service'
import { AppAdo, AppComponent, AppComponentAddress, AppConfig } from './types'

@Resolver(AppAdo)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => AppAdo, {
    deprecationReason: 'Moved to `ADO` query resolver, use `app` field on `ADO` to resolve this query.',
  })
  public async app(@Args('address') address: string): Promise<AppAdo> {
    const ado = await this.appService.getAdo<AppAdo>(address, AdoType.App)
    ado.owner = await this.appService.owner(address)
    ado.operators = await this.appService.operators(address)
    ado.isOperator = await this.appService.isOperator(address, address)
    ado.codeId = ado.andr.codeId
    ado.creator = ado.andr.creator
    ado.admin = ado.andr.admin
    ado.label = ado.andr.label
    ado.ibcPortId = ado.andr.ibcPortId
    ado.queries_expected = ado.andr.queries_expected

    console.log(ado)

    return ado
  }

  @ResolveField(() => AppConfig)
  public async config(@Parent() app: AppAdo): Promise<AppConfig> {
    return this.appService.config(app.address)
  }

  @ResolveField(() => [AppComponentAddress])
  public async addresses(@Parent() app: AppAdo): Promise<AppComponentAddress[]> {
    return this.appService.getAddresses(app.address)
  }

  @ResolveField(() => String)
  public async getAddress(@Parent() app: AppAdo, @Args('name') name: string): Promise<string> {
    return this.appService.getAddress(app.address, name)
  }

  @ResolveField(() => Boolean)
  public async componentExists(@Parent() app: AppAdo, @Args('name') name: string): Promise<boolean> {
    return this.appService.componentExists(app.address, name)
  }

  @ResolveField(() => [AppComponent])
  public async components(@Parent() app: AppAdo): Promise<AppComponent[]> {
    return this.appService.getComponents(app.address)
  }

  @ResolveField(() => String)
  public async chainId(@Parent() app: AppAdo): Promise<string> {
    return this.appService.getChainId(app.address)
  }
}
