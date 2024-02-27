import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { CW721Resolver } from './cw721.resolver'
import { CW721Service } from './cw721.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [CW721Resolver, CW721Service],
})
export class CW721Module {}
