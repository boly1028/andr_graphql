import { Test, TestingModule } from '@nestjs/testing'
import { getLoggerToken } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { FactoryService } from './factory.service'

describe('FactoryService', () => {
  let service: FactoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        {
          provide: getLoggerToken(FactoryService.name),
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

    service = module.get<FactoryService>(FactoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
