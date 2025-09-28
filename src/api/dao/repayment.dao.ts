import db from "../../db";
import {
  BindOrReplacements,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model, QueryOptions,
  UpdateOptions
} from "sequelize";
import { RepaymentCreationAttributes } from "../../db/models/repayment";
import { RepaymentAttributes } from "../../typings/repayment";

class RepaymentDao {
  constructor() {
  }

  async fetchOne(opts: FindOptions) {
    return await db.models.Repayment.findOne(opts);
  }

  async fetchAll(opts: FindOptions) {
    return await db.models.Repayment.findAll(opts);
  }

  async func<T extends keyof typeof Model>(method: T & string, field: Extract<keyof RepaymentAttributes, string>, query: FindOptions) {
    return await (db.models.Repayment[method] as Function)(field, query);
  }

  async transaction() {
    return await db.sequelize.transaction();
  }

  async fetchByPk(key: string, opts?: FindOptions) {
    return await db.models.Repayment.findByPk(key, opts);
  }

  async create(record: RepaymentCreationAttributes, opts?: CreateOptions) {
    return await db.models.Repayment.create(record, opts);
  }

  async update(record: Partial<RepaymentCreationAttributes>, opts: UpdateOptions) {
    return await db.models.Repayment.update(record, opts);
  }

  async delete(opts: DestroyOptions) {
    return await db.models.Repayment.destroy(opts);
  }

  async query(query: string, replacements?: BindOrReplacements, opts?: QueryOptions) {
    return await db.sequelize.query(query, { replacements, ...opts });
  }
}

export default RepaymentDao;
