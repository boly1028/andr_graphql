import { Module } from '@nestjs/common'
import { WasmModule } from 'src/wasm/wasm.module'
import { MerkleAirdropResolver } from './merkle-airdrop.resolver'
import { MerkleAirdropService } from './merkle-airdrop.service'

@Module({
  imports: [WasmModule],
  providers: [MerkleAirdropResolver, MerkleAirdropService],
})
export class MerkleAirdropModule {}
