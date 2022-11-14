import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { WasmService } from 'src/wasm/wasm.service'
import { SplitterService } from './splitter.service'

describe('SplitterService', () => {
  let service: SplitterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SplitterService,
        {
          provide: getLoggerToken(SplitterService.name),
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

    service = module.get<SplitterService>(SplitterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
