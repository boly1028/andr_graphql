import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { PrimitiveResolver } from './primitive.resolver'
import { PrimitiveService } from './primitive.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [PrimitiveResolver, PrimitiveService],
})
export class PrimitiveModule {}
