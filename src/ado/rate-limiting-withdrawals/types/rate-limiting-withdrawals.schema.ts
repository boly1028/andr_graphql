import { RATE_LIMITING_WITHDRAWALS_ACCOUNT } from './rate-limiting-withdrawals.constants'

export const RateLimitingWithdrawalsSchema = {
  coin_allowed_details: {
    coin_allowed_details: {},
  },
  account_details: {
    account_details: {
      account: RATE_LIMITING_WITHDRAWALS_ACCOUNT,
    },
  },
}
