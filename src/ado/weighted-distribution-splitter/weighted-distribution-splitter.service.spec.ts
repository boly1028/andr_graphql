import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { WeightedDistributionSplitterService } from './weighted-distribution-splitter.service'

describe('WeightedDistributionSplitterService', () => {
  let service: WeightedDistributionSplitterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeightedDistributionSplitterService,
        {
          provide: getLoggerToken(WeightedDistributionSplitterService.name),
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

    service = module.get<WeightedDistributionSplitterService>(WeightedDistributionSplitterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
