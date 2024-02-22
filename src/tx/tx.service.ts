import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
//import { decodeTxRaw } from '@cosmjs/proto-signing'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError, UserInputError } from 'apollo-server'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { ChainConfigService } from 'src/chain-config/chain-config.service'
import { InjectCosmClient } from 'src/cosm'
import { BlockInfo } from './types/block.result'
import {
  INTERNAL_TX_QUERY_ERR,
  INVALID_CHAIN_ERR,
  LOG_ERR_TX_QRY_ACCT_TXT,
  LOG_ERR_TX_QRY_CNTRCT_TXT,
  LOG_ERR_TX_QRY_HT_TXT,
  LOG_ERR_TX_QRY_OWNR_TXT,
  LOG_ERR_TX_QRY_TAG_TXT,
  LOG_ERR_TX_QRY_TXT,
  LOG_ERR_TX_QRY_RAW_TXT,
} from './types/tx.constants'
import { TxFilterParams, TxInfo, TxLog, TxSearchByTagArgs } from './types/tx.result'

@Injectable()
export class TxService {
  constructor(
    @InjectPinoLogger(TxService.name)
    protected readonly logger: PinoLogger,
    @InjectCosmClient()
    protected readonly cosmWasmClient: CosmWasmClient,
    @Inject(ChainConfigService) protected readonly chainConfigService: ChainConfigService,
  ) {}

  public async byHash(chainId: string, hash: string): Promise<TxInfo> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
      if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      const IndexedTx = await queryClient.getTx(hash)

      let txInfo = IndexedTx as TxInfo
      txInfo = this.parseTx(txInfo)
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_TXT, hash)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async byHeight(chainId: string, height: number): Promise<TxInfo[]> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
      if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      const indexedTxs = await queryClient.searchTx(
        // { height: height }
        `tx.height=${height}`,
      )

      let txInfo = indexedTxs as TxInfo[]
      txInfo = txInfo.map((tx) => this.parseTx(tx))
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_HT_TXT, height)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async byContract(chainId: string, contractAddress: string, filterParams?: TxFilterParams): Promise<TxInfo[]> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
      if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      let query = `execute._contract_address='${contractAddress}' AND message.module='wasm'`
      if (filterParams?.minHeight) query = query.concat(' AND ', `tx.height>=${filterParams?.minHeight}`)
      if (filterParams?.maxHeight) query = query.concat(' AND ', `tx.height<=${filterParams?.maxHeight}`)
      const indexedTxs = await queryClient.searchTx(query)

      let txInfo = indexedTxs as TxInfo[]
      txInfo = txInfo.map((tx) => this.parseTx(tx))
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_CNTRCT_TXT, contractAddress)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async byAccount(chainId: string, sentFromOrTo: string, filterParams?: TxFilterParams): Promise<TxInfo[]> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
      if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      let query = `sentFromOrTo='${sentFromOrTo}'`
      if (filterParams?.minHeight) query = query.concat(' AND ', `tx.height>=${filterParams?.minHeight}`)
      if (filterParams?.maxHeight) query = query.concat(' AND ', `tx.height<=${filterParams?.maxHeight}`)
      const indexedTxs = await queryClient.searchTx(query)

      let txInfo = indexedTxs as TxInfo[]
      txInfo = txInfo.map((tx) => this.parseTx(tx))
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_ACCT_TXT, sentFromOrTo)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async byOwner(chainId: string, walletAddress: string, filterParams?: TxFilterParams): Promise<TxInfo[]> {
    const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
    if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

    try {
      const queryClient = await CosmWasmClient.connect(chainUrl)
      let query = `wasm.owner='${walletAddress}' AND wasm.method='instantiate'`
      if (filterParams?.minHeight) query = query.concat(' AND ', `tx.height>=${filterParams?.minHeight}`)
      if (filterParams?.maxHeight) query = query.concat(' AND ', `tx.height<=${filterParams?.maxHeight}`)
      const indexedTxs = await queryClient.searchTx(query)

      let txInfo = indexedTxs as TxInfo[]
      txInfo = txInfo.map((tx) => this.parseTx(tx))
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_OWNR_TXT, walletAddress)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async byTag(chainId: string, tags: TxSearchByTagArgs, filterParams?: TxFilterParams): Promise<TxInfo[]> {
    const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
    if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

    try {
      const queryClient = await CosmWasmClient.connect(chainUrl)

      let query = ''
      if (tags.tags.length !== 0) {
        query = tags.tags.map(({ key, value }) => `${key}='${value}'`).join(' AND ')
        if (filterParams?.maxHeight) query = query.concat(' AND ', `tx.height<=${filterParams?.maxHeight}`)
      } else {
        if (filterParams?.maxHeight) query = query.concat(`tx.height<=${filterParams?.maxHeight}`)
      }
      if (filterParams?.maxHeight) {
        if (filterParams?.minHeight) query = query.concat(' AND ', `tx.height>=${filterParams?.minHeight}`)
      } else {
        if (filterParams?.minHeight) query = query.concat(`tx.height>=${filterParams?.minHeight}`)
      }

      const indexedTxs = await queryClient.searchTx(query)

      let txInfo = indexedTxs as TxInfo[]
      txInfo = txInfo.map((tx) => this.parseTx(tx))
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_TAG_TXT, tags)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async byRawString(chainId: string, query: string): Promise<TxInfo[]> {
    const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
    if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

    try {
      const queryClient = await CosmWasmClient.connect(chainUrl)
      const indexedTxs = await queryClient.searchTx(query)

      let txInfo = indexedTxs as TxInfo[]
      txInfo = txInfo.map((tx) => this.parseTx(tx))
      return txInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_RAW_TXT, query)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  public async getBlockInfo(chainId: string, height: number): Promise<BlockInfo> {
    try {
      const chainUrl = await this.chainConfigService.getChainUrl('', chainId)
      if (!chainUrl) throw new UserInputError(INVALID_CHAIN_ERR)

      const queryClient = await CosmWasmClient.connect(chainUrl)
      const blockInfo = await queryClient.getBlock(height)
      return blockInfo as BlockInfo
    } catch (err: any) {
      this.logger.error({ err }, LOG_ERR_TX_QRY_HT_TXT, height)
      throw new ApolloError(INTERNAL_TX_QUERY_ERR)
    }
  }

  private parseTx(tx: TxInfo): TxInfo {
    if (tx.rawLog) {
      tx.txLog = JSON.parse(tx.rawLog) as TxLog[]
      tx.events = tx.txLog.flatMap((log) => log.events)
      //[ ...rawLogJSON[0].events ]
    }

    // if (tx.tx){
    //   const txRaw = decodeTxRaw(tx.tx))
    // }

    return tx
  }
}
