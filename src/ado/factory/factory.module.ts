import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { FactoryResolver } from './factory.resolver'
import { FactoryService } from './factory.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [FactoryResolver, FactoryService],
})
export class FactoryModule {}
