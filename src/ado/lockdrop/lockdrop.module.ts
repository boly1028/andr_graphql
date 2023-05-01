import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { LockdropResolver } from './lockdrop.resolver'
import { LockdropService } from './lockdrop.service'

@Module({
  imports: [WasmModule],
  providers: [LockdropResolver, LockdropService],
})
export class LockdropModule {}
