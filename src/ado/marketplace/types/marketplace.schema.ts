import {
  MARKETPLACE_QUERY_TOKEN_ID,
  MARKETPLACE_QUERY_TOKEN_ADDRESS,
  MARKETPLACE_QUERY_SALE_ID,
} from './marketplace.constants'

export const MarketplaceSchema = {
  latest_sale_state: {
    latest_sale_state: {
      token_id: MARKETPLACE_QUERY_TOKEN_ID,
      token_address: MARKETPLACE_QUERY_TOKEN_ADDRESS,
    },
  },
  sale_state: {
    sale_state: {
      sale_id: MARKETPLACE_QUERY_SALE_ID,
    },
  },
  sale_ids: {
    sale_ids: {
      token_id: MARKETPLACE_QUERY_TOKEN_ID,
      token_address: MARKETPLACE_QUERY_TOKEN_ADDRESS,
    },
  },
  sale_infos_for_address: {
    sale_infos_for_address: {
      token_address: MARKETPLACE_QUERY_TOKEN_ADDRESS,
    },
  },
}
