import { VESTING_BATCH_ID } from './vesting.constants'

export const VestingSchema = {
  state: {
    state: {},
  },
  config: {
    config: {},
  },
  batch: {
    batch: {
      id: VESTING_BATCH_ID,
    },
  },
  batches: {
    batches: {},
  },
}
