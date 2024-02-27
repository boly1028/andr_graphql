import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { AddresslistResolver } from './addresslist.resolver'
import { AddresslistService } from './addresslist.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [AddresslistResolver, AddresslistService],
})
export class AddresslistModule {}
