import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { CrowdfundService } from './crowdfund.service'

describe('CrowdfundService', () => {
  let service: CrowdfundService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrowdfundService,
        {
          provide: getLoggerToken(CrowdfundService.name),
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

    service = module.get<CrowdfundService>(CrowdfundService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
