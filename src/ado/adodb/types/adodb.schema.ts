import {
  ADODB_QUERY_CODE_ID,
  ADODB_QUERY_IS_UNPUBLISHED_CODE_ID,
  ADODB_QUERY_ADO_TYPE,
  ADODB_QUERY_START_AFTER,
  ADODB_QUERY_LIMIT,
  ADODB_QUERY_ACTION,
} from './adodb.constants'

export const AdoDBSchema = {
  code_id: {
    code_id: {
      key: ADODB_QUERY_CODE_ID,
    },
  },
  is_unpublished_code_id: {
    is_unpublished_code_id: {
      code_id: ADODB_QUERY_IS_UNPUBLISHED_CODE_ID,
    },
  },
  ado_type: {
    ado_type: {
      code_id: ADODB_QUERY_ADO_TYPE,
    },
  },
  all_ado_types: {
    all_ado_types: {
      start_after: ADODB_QUERY_START_AFTER,
      limit: ADODB_QUERY_LIMIT,
    },
  },
  ado_versions: {
    ado_versions: {
      ado_type: ADODB_QUERY_ADO_TYPE,
      start_after: ADODB_QUERY_START_AFTER,
      limit: ADODB_QUERY_LIMIT,
    },
  },
  ado_metadata: {
    ado_metadata: {
      ado_type: ADODB_QUERY_ADO_TYPE,
    },
  },
  action_fee: {
    action_fee: {
      ado_type: ADODB_QUERY_ADO_TYPE,
      action: ADODB_QUERY_ACTION,
    },
  },
  action_fee_by_code_id: {
    action_fee_by_code_id: {
      code_id: ADODB_QUERY_CODE_ID,
      action: ADODB_QUERY_ACTION,
    },
  },
  version: {
    version: {},
  },
  owner: {
    owner: {},
  },
  type: {
    type: {},
  },
  kernel_address: {
    kernel_address: {},
  },
}
