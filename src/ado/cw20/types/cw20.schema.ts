import { CW20_ALLOWANCE_OWNER, CW20_ALLOWANCE_SPENDER, CW20_BALANCE_ADDRESS } from './cw20.constants'

export const CW20Schema = {
  balance: {
    balance: {
      address: CW20_BALANCE_ADDRESS,
    },
  },
  token_info: {
    token_info: {},
  },
  minter: {
    minter: {},
  },
  allowance: {
    allowance: {
      owner: CW20_ALLOWANCE_OWNER,
      spender: CW20_ALLOWANCE_SPENDER,
    },
  },
  all_allowances: {
    all_allowances: {
      owner: CW20_ALLOWANCE_OWNER,
    },
  },
  all_spender_allowances: {
    all_spender_allowances: {
      spender: CW20_ALLOWANCE_SPENDER,
    },
  },
  all_accounts: {
    all_accounts: {},
  },
  marketing_info: {
    marketing_info: {},
  },
  download_logo: {
    download_logo: {},
  },
}
