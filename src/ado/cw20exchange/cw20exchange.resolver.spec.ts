import { Test, TestingModule } from '@nestjs/testing'
import { CW20ExchangeResolver } from './cw20exchange.resolver'
import { CW20ExchangeService } from './cw20exchange.service'

describe('CW20ExchangeResolver', () => {
  let resolver: CW20ExchangeResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CW20ExchangeResolver, { provide: CW20ExchangeService, useValue: {} }],
    }).compile()

    resolver = module.get<CW20ExchangeResolver>(CW20ExchangeResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
