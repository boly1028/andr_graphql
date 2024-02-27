import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { MarketplaceResolver } from './marketplace.resolver'
import { MarketplaceService } from './marketplace.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [MarketplaceResolver, MarketplaceService],
})
export class MarketplaceModule {}
