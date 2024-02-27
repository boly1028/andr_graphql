import { Module } from '@nestjs/common'
import { ChainConfigModule } from 'src/chain-config/chain-config.module'
import { WasmModule } from 'src/wasm/wasm.module'
import { MerkleAirdropResolver } from './merkle-airdrop.resolver'
import { MerkleAirdropService } from './merkle-airdrop.service'

@Module({
  imports: [WasmModule, ChainConfigModule],
  providers: [MerkleAirdropResolver, MerkleAirdropService],
})
export class MerkleAirdropModule {}
