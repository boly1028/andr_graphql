import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { LockdropService } from './lockdrop.service'

describe('LockdropService', () => {
  let service: LockdropService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LockdropService,
        {
          provide: getLoggerToken(LockdropService.name),
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

    service = module.get<LockdropService>(LockdropService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})