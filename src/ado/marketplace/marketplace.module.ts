import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { MarketplaceResolver } from './marketplace.resolver'
import { MarketplaceService } from './marketplace.service'

@Module({
  imports: [WasmModule],
  providers: [MarketplaceResolver, MarketplaceService],
})
export class MarketplaceModule {}
