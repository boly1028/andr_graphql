import { USER_ADDRESS } from './weighted-distribution-splitter.constants'

export const WeightedDistributionSplitterSchema = {
  config: {
    get_splitter_config: {},
  },
  get_user_weight: {
    get_user_weight: {
      user: {
        addr: USER_ADDRESS,
      },
    },
  },
}
