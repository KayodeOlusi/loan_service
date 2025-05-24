import { autoInjectable } from "tsyringe";
import { TransactionDao } from "../dao";
import { FindOptions, UpdateOptions } from "sequelize";
import { TransactionAttributes, TransactionCreationBody } from "../../typings/transaction";

@autoInjectable()
class TransactionService {
  private TransactionDAO: TransactionDao;

  constructor(_transactionDao: TransactionDao) {
    this.TransactionDAO = _transactionDao;
  }

  async getTransaction(where: Partial<TransactionAttributes>, opts?: FindOptions) {
    return await this.TransactionDAO.fetchOne({
      where,
      ...opts
    });
  }

  async getTransactionByPk(key: string, opts?: FindOptions) {
    return await this.TransactionDAO.fetchByPk(key, opts);
  }

  async getTransactions(where: Partial<TransactionAttributes>, opts?: FindOptions) {
    return await this.TransactionDAO.fetchAll({
      where,
      ...opts
    });
  }

  async getPaginatedTransactions(where?: Partial<TransactionAttributes>, opts?: FindOptions) {
    return await this.TransactionDAO.paginateFetch({
      where,
      ...opts
    });
  }

  async createTransaction(data: TransactionCreationBody, opts?: FindOptions) {
    return await this.TransactionDAO.create(data, opts);
  }

  async updateTransaction(data: Partial<TransactionCreationBody>, opts: UpdateOptions) {
    return await this.TransactionDAO.updateOne(data, opts);
  }
}

export default TransactionService;