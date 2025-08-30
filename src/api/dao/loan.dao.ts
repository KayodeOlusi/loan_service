import db from "../../db";
import Loan, { LoanCreationAttributes } from "../../db/models/loan";
import { CreateOptions, DestroyOptions, FindOptions, Model, UpdateOptions } from "sequelize";
import { LoanAttributes } from "../../typings/loan";

class LoanDao {
  constructor() {
  }
  
  async fetchOne(opts: FindOptions) {
    return await db.models.Loan.findOne(opts);
  }

  async fetchAll(opts: FindOptions) {
    return await db.models.Loan.findAll(opts);
  }

  async func<T extends keyof typeof Model>(method: T & string, field: Extract<keyof LoanAttributes, string>, query: FindOptions) {
    return await (db.models.Loan[method] as Function)(field, query);
  }

  async transaction() {
    return await db.sequelize.transaction();
  }

  async fetchByPk(key: string, opts?: FindOptions) {
    return await db.models.Loan.findByPk(key, opts);
  }

  async create(record: LoanCreationAttributes, opts?: CreateOptions) {
    return await db.models.Loan.create(record, opts);
  }

  async update(record: Partial<LoanCreationAttributes>, opts: UpdateOptions) {
    return await db.models.Loan.update(record, opts);
  }

  async delete(opts: DestroyOptions) {
    return await db.models.Loan.destroy(opts);
  }
}

export default LoanDao;