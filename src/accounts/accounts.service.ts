import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ApolloError, UserInputError } from 'apollo-server'
import { Model } from 'mongoose'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { AndrOrderBy } from 'src/ado/types/ado.enums'
import { Ado, AssetFilterArgs, AssetResult } from './assets/types'
import { DEFAULT_CATCH_ERR, MONGO_QUERY_ERROR } from './types'

@Injectable()
export class AccountsService {
  constructor(
    @InjectPinoLogger(AccountsService.name)
    protected readonly logger: PinoLogger,
    @InjectModel(Ado.name)
    private adoModel?: Model<Ado>,
  ) {}

  public async getAssets(owner: string, filter: AssetFilterArgs): Promise<AssetResult[]> {
    try {
      const query: any = { owner: owner }
      if (filter.adoType) {
        query.adoType = filter.adoType
      }
      if (filter.search?.trim()) {
        query.name = { $regex: new RegExp(filter.search, 'i') }
      }
      const orderBy = filter.orderBy === AndrOrderBy.Asc ? 1 : -1

      const ados = await this.adoModel
        ?.find(query)
        .sort({ lastUpdatedHeight: orderBy })
        .limit(filter.limit)
        .skip(filter.offset)

      if (!ados || !ados.length) return []

      return ados
    } catch (err: any) {
      this.logger.error({ err }, DEFAULT_CATCH_ERR, owner)
      if (err instanceof UserInputError || err instanceof ApolloError) {
        throw err
      }

      throw new ApolloError(MONGO_QUERY_ERROR, owner)
    }
  }
}
