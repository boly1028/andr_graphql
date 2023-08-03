import { ANDR_QUERY_OPERATOR } from './andr-query.constants'

export const AndrQuerySchema = {
  owner: {
    owner: {},
  },
  operators: {
    operators: {},
  },
  is_operator: {
    is_operator: {
      address: ANDR_QUERY_OPERATOR,
    },
  },
  type: {
    type: {},
  },
  block_height_upon_creation: {
    block_height_upon_creation: {},
  },
  version: {
    version: {},
  },
  original_publisher: {
    original_publisher: {},
  },
}

export const AndrQuerySchemaOld = {
  owner: {
    andr_query: {
      owner: {},
    },
  },
  operators: {
    andr_query: {
      operators: {},
    },
  },
  is_operator: {
    andr_query: {
      is_operator: {
        address: ANDR_QUERY_OPERATOR,
      },
    },
  },
  type: {
    andr_query: {
      type: {},
    },
  },
  block_height_upon_creation: {
    andr_query: {
      block_height_upon_creation: {},
    },
  },
  version: {
    andr_query: {
      version: {},
    },
  },
  original_publisher: {
    andr_query: {
      original_publisher: {},
    },
  },
}
