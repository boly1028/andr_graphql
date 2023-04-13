import { Test, TestingModule } from '@nestjs/testing'
import { CW20StakingResolver } from './cw20staking.resolver'
import { CW20StakingService } from './cw20staking.service'

describe('CW20StakingResolver', () => {
  let resolver: CW20StakingResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CW20StakingResolver, { provide: CW20StakingService, useValue: {} }],
    }).compile()

    resolver = module.get<CW20StakingResolver>(CW20StakingResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
