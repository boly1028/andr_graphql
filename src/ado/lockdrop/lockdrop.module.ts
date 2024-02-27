import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { LockdropResolver } from './lockdrop.resolver'
import { LockdropService } from './lockdrop.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [LockdropResolver, LockdropService],
})
export class LockdropModule {}
