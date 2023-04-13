import { CW20_STAKER_ADDRESS } from './cw20staking.constants'

export const CW20StakingSchema = {
  config: {
    config: {},
  },
  state: {
    state: {},
  },
  staker: {
    staker: {
      address: CW20_STAKER_ADDRESS,
    },
  },
  stakers: {
    stakers: {},
  },
  timestamp: {
    timestamp: {},
  },
}
