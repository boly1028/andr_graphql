import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { VaultResolver } from './vault.resolver'
import { VaultService } from './vault.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [VaultResolver, VaultService],
})
export class VaultModule {}
