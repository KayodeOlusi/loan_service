import { autoInjectable } from "tsyringe";
import { RepaymentDao } from "../dao";
import {
  BindOrReplacements,
  CreateOptions,
  FindOptions,
  QueryOptions,
  UpdateOptions
} from "sequelize";
import { RepaymentAttributes, RepaymentCreationBody } from "../../typings/repayment";

@autoInjectable()
class RepaymentService {
  private readonly RepaymentDao;

  constructor(_RepaymentDao: RepaymentDao) {
    this.RepaymentDao = _RepaymentDao;
  }

  async getRepayments(where: Partial<RepaymentAttributes>, opts?: FindOptions) {
    return await this.RepaymentDao.fetchAll({
      where,
      ...opts
    });
  }

  async getRepayment(where: Partial<RepaymentAttributes>, opts?: FindOptions) {
    return await this.RepaymentDao.fetchOne({
      where,
      ...opts
    });
  }

  async sumRepayments(column: keyof Partial<RepaymentAttributes>, where: Partial<RepaymentAttributes>, opts?: FindOptions): Promise<number> {
    return await this.RepaymentDao.func("sum", column, {
      where,
      ...opts
    });
  }

  async getById(id: string, opts?: FindOptions) {
    return await this.RepaymentDao.fetchByPk(id, opts);
  }

  async updateRepayment(data: Partial<RepaymentAttributes>, opts: UpdateOptions) {
    return await this.RepaymentDao.update(data, opts);
  }

  async createRepayment(data: RepaymentCreationBody, opts?: CreateOptions) {
    return await this.RepaymentDao.create(data, opts);
  }

  async queryRepayments(query: string, replacements?: BindOrReplacements, opts?: QueryOptions) {
    return await this.RepaymentDao.query(query, replacements, opts);
  }

  async dbTransactionInstance() {
    return await this.RepaymentDao.transaction();
  }
}

export default RepaymentService;
