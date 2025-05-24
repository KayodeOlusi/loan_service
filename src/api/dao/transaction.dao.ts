import db from "../../db";
import { TransactionCreationAttributes } from "../../db/models/transaction";
import { FindOptions, UpdateOptions, DestroyOptions, CreateOptions } from "sequelize";

class TransactionDao {
  constructor() {
  }

  async fetchOne(query: FindOptions) {
    return await db.models.Transaction.findOne(query);
  }

  async fetchAll(query: FindOptions) {
    return await db.models.Transaction.findAll(query);
  }

  async paginateFetch(query: FindOptions) {
    return await db.models.Transaction.findAndCountAll(query);
  }

  async fetchByPk(key: string, query?: FindOptions) {
    return await db.models.Transaction.findByPk(key, query);
  }

  async create(record: TransactionCreationAttributes, opts?: CreateOptions) {
    return await db.models.Transaction.create(record, opts);
  }

  async updateOne(record: Partial<TransactionCreationAttributes>, query: UpdateOptions) {
    return await db.models.Transaction.update(record, query);
  }

  async delete(query: DestroyOptions) {
    return await db.models.Transaction.destroy(query);
  }
}

export default TransactionDao;