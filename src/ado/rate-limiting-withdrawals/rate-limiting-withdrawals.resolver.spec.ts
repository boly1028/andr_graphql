import { Test, TestingModule } from '@nestjs/testing'
import { RateLimitingWithdrawalsResolver } from './rate-limiting-withdrawals.resolver'
import { RateLimitingWithdrawalsService } from './rate-limiting-withdrawals.service'

describe('TimelockResolver', () => {
  let resolver: RateLimitingWithdrawalsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimitingWithdrawalsResolver, { provide: RateLimitingWithdrawalsService, useValue: {} }],
    }).compile()

    resolver = module.get<RateLimitingWithdrawalsResolver>(RateLimitingWithdrawalsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
