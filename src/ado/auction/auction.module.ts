import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { AuctionResolver } from './auction.resolver'
import { AuctionService } from './auction.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [AuctionResolver, AuctionService],
})
export class AuctionModule {}
