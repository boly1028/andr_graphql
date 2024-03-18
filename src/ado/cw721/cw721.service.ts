import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { WasmService } from 'src/wasm/wasm.service'
import { AdoService } from '../ado.service'
import { INVALID_QUERY_ERR, AndrSearchOptions } from '../types'
import { NftInfo, NftOwnerInfo } from './types'
import { AllNftInfo, NftApproval, NftContractInfo, TransferAgreement } from './types'
import { SearchAttribute } from './types'
import { NFT_QUERY_INCLUDE_EXPIRED, CW721Schema, NFT_QUERY_OWNER, NFT_QUERY_SPENDER, NFT_QUERY_TOKEN_ID } from './types'

@Injectable()
export class CW721Service extends AdoService {
  constructor(
    @InjectPinoLogger(CW721Service.name)
    protected readonly logger: PinoLogger,
    @Inject(WasmService)
    protected readonly wasmService: WasmService,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {
    super(logger, wasmService, chainConfigService)
  }

  public async minter(contractAddress: string): Promise<string> {
    try {
      const minterInfo = await this.wasmService.queryContract(contractAddress, CW721Schema.minter)
      return (minterInfo as string) ?? ''
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async ownerOf(contractAddress: string, tokenId: string, includeExpired: boolean): Promise<NftOwnerInfo> {
    const queryMsgStr = JSON.stringify(CW721Schema.owner_of)
      .replace(NFT_QUERY_TOKEN_ID, tokenId)
      .replace('"' + NFT_QUERY_INCLUDE_EXPIRED + '"', String(includeExpired))
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const ownerInfo = await this.wasmService.queryContract(contractAddress, queryMsg)
      return ownerInfo as NftOwnerInfo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allOperators(
    contractAddress: string,
    owner: string,
    includeExpired: boolean,
    options?: AndrSearchOptions,
  ): Promise<NftApproval[]> {
    const queryMsgStr = JSON.stringify(CW721Schema.all_operators)
      .replace(NFT_QUERY_OWNER, owner)
      .replace('"' + NFT_QUERY_INCLUDE_EXPIRED + '"', String(includeExpired))
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const allOperators = await this.wasmService.queryContract(contractAddress, queryMsg)
      return allOperators.operators ?? []
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async approval(
    contractAddress: string,
    tokenId: string,
    spender: string,
    includeExpired: boolean,
  ): Promise<NftApproval> {
    const queryMsgStr = JSON.stringify(CW721Schema.approval)
      .replace(NFT_QUERY_TOKEN_ID, tokenId)
      .replace(NFT_QUERY_SPENDER, spender)
      .replace('"' + NFT_QUERY_INCLUDE_EXPIRED + '"', String(includeExpired))
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const approvedForAll = await this.wasmService.queryContract(contractAddress, queryMsg)
      return approvedForAll as NftApproval
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async approvals(contractAddress: string, tokenId: string, includeExpired: boolean): Promise<NftApproval[]> {
    const queryMsgStr = JSON.stringify(CW721Schema.approvals)
      .replace(NFT_QUERY_TOKEN_ID, tokenId)
      .replace('"' + NFT_QUERY_INCLUDE_EXPIRED + '"', String(includeExpired))
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const approvals = await this.wasmService.queryContract(contractAddress, queryMsg)
      return approvals as NftApproval[]
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async numTokens(contractAddress: string): Promise<number> {
    try {
      const numTokens = await this.wasmService.queryContract(contractAddress, CW721Schema.num_tokens)
      return numTokens.count ?? 0
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async nftInfo(contractAddress: string, tokenId: string): Promise<NftInfo> {
    const queryMsgStr = JSON.stringify(CW721Schema.nft_info).replace(NFT_QUERY_TOKEN_ID, tokenId)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const nftInfo = await this.wasmService.queryContract(contractAddress, queryMsg)
      return nftInfo as NftInfo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allNftInfo(contractAddress: string, tokenId: string, includeExpired: boolean): Promise<AllNftInfo> {
    const queryMsgStr = JSON.stringify(CW721Schema.all_nft_info)
      .replace(NFT_QUERY_TOKEN_ID, tokenId)
      .replace('"' + NFT_QUERY_INCLUDE_EXPIRED + '"', String(includeExpired))
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const allNftInfo = await this.wasmService.queryContract(contractAddress, queryMsg)
      return allNftInfo as AllNftInfo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async isArchived(contractAddress: string, tokenId: string): Promise<boolean> {
    const queryMsgStr = JSON.stringify(CW721Schema.is_archived).replace(NFT_QUERY_TOKEN_ID, tokenId)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const isArchived = await this.wasmService.queryContract(contractAddress, queryMsg)
      return isArchived as boolean
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async transferAgreement(contractAddress: string, tokenId: string): Promise<TransferAgreement> {
    const queryMsgStr = JSON.stringify(CW721Schema.transfer_agreeement).replace(NFT_QUERY_TOKEN_ID, tokenId)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const transferAgreement = await this.wasmService.queryContract(contractAddress, queryMsg)
      return transferAgreement as TransferAgreement
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async tokens(contractAddress: string, owner: string, options?: AndrSearchOptions): Promise<string[]> {
    const queryMsgStr = JSON.stringify(CW721Schema.tokens).replace(NFT_QUERY_OWNER, owner)
    const queryMsg = JSON.parse(queryMsgStr)

    try {
      const tokenResponse = await this.wasmService.queryContract(contractAddress, queryMsg)
      return tokenResponse.tokens ?? []
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async allTokens(contractAddress: string, options?: AndrSearchOptions): Promise<string[]> {
    try {
      const tokenResponse = await this.wasmService.queryContract(contractAddress, CW721Schema.all_tokens)
      return tokenResponse.tokens ?? []
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async searchTokens(contractAddress: string, attributes?: SearchAttribute[]): Promise<NftInfo[]> {
    try {
      const response = await this.wasmService.queryContract(contractAddress, CW721Schema.all_tokens)
      const tokens: NftInfo[] = await Promise.all(
        response.tokens.map(async (tokenId: string) => {
          return this.nftInfo(contractAddress, tokenId)
        }),
      )

      if (!attributes?.length) return tokens

      // filter tokens by search attributes
      const filteredTokens = tokens.filter((token) => {
        const containsAttribute = token.extension?.attributes.some((tokenAttr) => {
          return attributes.some((attr) => {
            if (attr.value !== undefined) {
              return attr.trait_type === tokenAttr.trait_type && attr.value === tokenAttr.value
            }

            return attr.trait_type === tokenAttr.trait_type
          })
        })

        return containsAttribute
      })

      return filteredTokens
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async contractInfo(contractAddress: string): Promise<NftContractInfo> {
    try {
      const contractInfo = await this.wasmService.queryContract(contractAddress, CW721Schema.contract_info)
      return contractInfo as NftContractInfo
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }

  public async numOwners(contractAddress: string, includeExpired: boolean): Promise<number> {
    try {
      const response = await this.wasmService.queryContract(contractAddress, CW721Schema.all_tokens)
      const numOwners: string[] = []
      for (const tokenId of response.tokens) {
        const ownerInfo: NftOwnerInfo = await this.ownerOf(contractAddress, tokenId, includeExpired)
        if (ownerInfo.owner && !numOwners.includes(ownerInfo.owner)) {
          numOwners.push(ownerInfo.owner)
        }
      }
      return numOwners.length
    } catch (err: any) {
      this.logger.error({ err }, 'Error getting the wasm contract %s query.', contractAddress)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(INVALID_QUERY_ERR)
    }
  }
}
