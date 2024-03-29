import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { MerkleAirdropService } from './merkle-airdrop.service'

describe('CrowdfundService', () => {
  let service: MerkleAirdropService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerkleAirdropService,
        {
          provide: getLoggerToken(MerkleAirdropService.name),
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: WasmService,
          useValue: {},
        },
        {
          provide: ChainConfigService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<MerkleAirdropService>(MerkleAirdropService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
