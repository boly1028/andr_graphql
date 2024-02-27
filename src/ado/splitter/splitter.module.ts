import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { SplitterResolver } from './splitter.resolver'
import { SplitterService } from './splitter.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [SplitterResolver, SplitterService],
})
export class SplitterModule {}
