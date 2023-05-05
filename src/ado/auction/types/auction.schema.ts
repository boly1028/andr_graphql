import { AUCTION_QUERY_AUCTION_ID, AUCTION_QUERY_TOKEN_ADDRESS, AUCTION_QUERY_TOKEN_ID } from './auction.constants'

export const AuctionSchema = {
  latest_auction_state: {
    latest_auction_state: {
      token_id: AUCTION_QUERY_TOKEN_ID,
      token_address: AUCTION_QUERY_TOKEN_ADDRESS,
    },
  },
  auction_ids: {
    auction_ids: {
      token_id: AUCTION_QUERY_TOKEN_ID,
      token_address: AUCTION_QUERY_TOKEN_ADDRESS,
    },
  },
  auction_state: {
    auction_state: {
      auction_id: AUCTION_QUERY_AUCTION_ID,
    },
  },
  bids: {
    bids: {
      auction_id: AUCTION_QUERY_AUCTION_ID,
    },
  },
  auction_infos_for_address: {
    auction_infos_for_address: {
      token_address: AUCTION_QUERY_TOKEN_ADDRESS,
    },
  },
}
