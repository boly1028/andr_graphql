import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { TimelockService } from './timelock.service'

describe('TimelockService', () => {
  let service: TimelockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelockService,
        {
          provide: getLoggerToken(TimelockService.name),
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

    service = module.get<TimelockService>(TimelockService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
