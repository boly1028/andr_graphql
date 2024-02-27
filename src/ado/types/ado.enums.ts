import { registerEnumType } from '@nestjs/graphql'

export type Denom = string

export enum ProposalStatus {
  DepositPeriod = 'DepositPeriod',
  VotingPeriod = 'VotingPeriod',
  Passed = 'Passed',
  Rejected = 'Rejected',
  Failed = 'Failed',
}

export enum VoteOption {
  Empty = 'Empty',
  Yes = 'Yes',
  Abstain = 'Abstain',
  No = 'No',
  NoWithVeto = 'NoWithVeto',
}

export enum OrderBy {
  ORDER_BY_ASC = 1,
  ORDER_BY_DESC = 2,
}

export enum AdoType {
  Ado = 'ado',
  AddressList = 'address-list',
  Auction = 'auction',
  App = 'app',
  Crowdfund = 'crowdfund',
  CW20Staking = 'cw20-staking',
  CW20Exchange = 'cw20-exchange',
  CW20 = 'cw20',
  CW721 = 'cw721',
  CW721Bids = 'cw721-bids',
  Factory = 'factory',
  Gumball = 'gumball',
  Lockdrop = 'lockdrop',
  Marketplace = 'marketplace',
  MerkleAirdrop = 'merkle-airdrop',
  NftStaking = 'nft-staking',
  CW721Timelock = 'cw721-timelock',
  Primitive = 'primitive',
  Rates = 'rates',
  RateLimitingWithdrawals = 'rate-limiting-withdrawals',
  Receipt = 'receipt',
  Splitter = 'splitter',
  Timelock = 'timelock',
  WeightedDistributionSplitter = 'weighted-distribution-splitter',
  WrappedCW721 = 'wrapped_cw721',
  Vault = 'vault',
  Vesting = 'vesting',
  WeightedSplitter = 'weighted-splitter',
  Unknown = 'unknown',
}

//ERR: TS enums vs Rust enums
export enum AndrExpirationType {
  AtHeight = 'AtHeight',
  AtTime = 'AtTime',
  Never = 'Never',
}

export enum AndrModuleType {
  Rates = 'rates',
  Offers = 'offers',
  AddressList = 'address_list',
  Receipt = 'receipt',
}

export enum AndrOrderBy {
  Asc = 'asc',
  Desc = 'desc',
}

export enum AndrRecipientType {
  Addr = 'Addr',
  ADO = 'ADO',
}

//ERR: TS enums vs Rust enums
export enum AndrRateType {
  Flat = 'Coin',
  Percent = 'PercentRate',
  External = 'ADORate',
}

export enum AndrStrategyType {
  Anchor = 'Anchor',
}

export enum SmartQueryType {
  AllAdoTypes = 'all_ado_types',
}

export function registerEnums() {
  registerEnumType(ProposalStatus, {
    name: 'ProposalStatus',
  })

  registerEnumType(VoteOption, {
    name: 'VoteOption',
  })

  registerEnumType(OrderBy, {
    name: 'OrderBy',
  })

  registerEnumType(AdoType, {
    name: 'AdoType',
  })

  registerEnumType(AndrExpirationType, {
    name: 'AndrExpirationType',
  })

  registerEnumType(AndrModuleType, {
    name: 'AndrModuleType',
  })

  registerEnumType(AndrOrderBy, {
    name: 'AndrOrderBy',
  })

  registerEnumType(AndrRecipientType, {
    name: 'AndrRecipientType',
  })

  registerEnumType(AndrRateType, {
    name: 'AndrRateType',
  })

  registerEnumType(AndrStrategyType, {
    name: 'AndrStrategyType',
  })
}
