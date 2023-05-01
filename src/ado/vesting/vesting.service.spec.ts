import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { VestingService } from './vesting.service'

describe('VestingService', () => {
  let service: VestingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VestingService,
        {
          provide: getLoggerToken(VestingService.name),
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: WasmService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<VestingService>(VestingService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
