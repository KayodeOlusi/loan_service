import db from "../../db";
import { AccountCreationAttributes } from "../../db/models/account";
import { FindOptions, UpdateOptions, DestroyOptions, CreateOptions } from "sequelize";

class AccountDao {
  constructor() {
  }

  async fetchOne(query: FindOptions) {
    return await db.models.Account.findOne(query);
  }

   async fetchAll(query: FindOptions) {
    return await db.models.Account.findAll(query);
  }

   async fetchByPk(key: string) {
    return await db.models.Account.findByPk(key);
  }

   async create(record: AccountCreationAttributes, opts?: CreateOptions) {
    return await db.models.Account.create(record, opts);
  }

   async updateOne(record: Partial<AccountCreationAttributes>, query: UpdateOptions) {
    return await db.models.Account.update(record, query);
  }

   async delete(query: DestroyOptions) {
    return await db.models.Account.destroy(query);
  }
}

export default AccountDao;