import { Test, TestingModule } from '@nestjs/testing'
import { MerkleAirdropResolver } from './merkle-airdrop.resolver'
import { MerkleAirdropService } from './merkle-airdrop.service'

describe('CrowdfundResolver', () => {
  let resolver: MerkleAirdropResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerkleAirdropResolver, { provide: MerkleAirdropService, useValue: {} }],
    }).compile()

    resolver = module.get<MerkleAirdropResolver>(MerkleAirdropResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
