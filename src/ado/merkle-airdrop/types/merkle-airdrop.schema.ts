import { MERKLE_AIRDROP_ADDRESS, MERKLE_AIRDROP_STAGE } from './merkle-airdrop.constants'

export const MerkleAirdropSchema = {
  config: {
    config: {},
  },
  merkle_root: {
    merkle_root: {
      stage: MERKLE_AIRDROP_STAGE,
    },
  },
  latest_stage: {
    latest_stage: {},
  },
  is_claimed: {
    is_claimed: {
      stage: MERKLE_AIRDROP_STAGE,
      address: MERKLE_AIRDROP_ADDRESS,
    },
  },
  total_claimed: {
    total_claimed: {
      stage: MERKLE_AIRDROP_STAGE,
    },
  },
}
