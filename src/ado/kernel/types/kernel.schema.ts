import {
  KERNEL_QUERY_KEY_ADDRESS,
  KERNEL_QUERY_VERIFY_ADDRESS,
  KERNEL_QUERY_CHANNEL_INFO,
  KERNEL_QUERY_RECOVERIES,
} from './kernel.constants'

export const KernelSchema = {
  key_address: {
    key_address: {
      key: KERNEL_QUERY_KEY_ADDRESS,
    },
  },
  verify_address: {
    verify_address: {
      address: KERNEL_QUERY_VERIFY_ADDRESS,
    },
  },
  channel_info: {
    channel_info: {
      chain: KERNEL_QUERY_CHANNEL_INFO,
    },
  },
  recoveries: {
    recoveries: {
      addr: KERNEL_QUERY_RECOVERIES,
    },
  },
}
