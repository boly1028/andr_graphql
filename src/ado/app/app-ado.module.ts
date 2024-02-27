import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { AppResolver } from './app.resolver'
import { AppService } from './app.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [AppResolver, AppService],
})
export class AppAdoModule {}
