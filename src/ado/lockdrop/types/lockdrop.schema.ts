import { LOCKDROP_TIMESTAMP, LOCKDROP_USER_ADDRESS } from './lockdrop.constants'

export const LockdropSchema = {
  state: {
    state: {},
  },
  config: {
    config: {},
  },
  user_info: {
    user_info: {
      address: LOCKDROP_USER_ADDRESS,
    },
  },
  withdrawal_percent_allowed: {
    withdrawal_percent_allowed: {
      timestamp: LOCKDROP_TIMESTAMP,
    },
  },
}
