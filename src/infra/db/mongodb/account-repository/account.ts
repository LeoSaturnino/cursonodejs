import { MongoHelper } from './../helpers/mongo-helper'
import { AddAccountModel } from './../../../../domain/usecases/add-account'
import { AccountModel } from './../../../../domain/models/account'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const accountId = result.insertedId
    const account = { ...accountData, id: accountId.toString() }
    return account
  }
}
