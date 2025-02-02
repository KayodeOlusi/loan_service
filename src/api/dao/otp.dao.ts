import db from "../../db";
import { OtpCreationAttributes } from "../../db/models/otp";
import { FindOptions, UpdateOptions, DestroyOptions, CreateOptions } from "sequelize";

class OtpDao {
  constructor() {
  }

  async fetchOne(query: FindOptions) {
    return await db.models.Otp.findOne(query);
  }

  async fetchAll(query: FindOptions) {
    return await db.models.Otp.findAll(query);
  }

  async fetchByPk(key: string) {
    return await db.models.Otp.findByPk(key);
  }

  async create(record: OtpCreationAttributes, opts?: CreateOptions) {
    return await db.models.Otp.create(record, opts);
  }

  async updateOne(record: Partial<OtpCreationAttributes>, query: UpdateOptions) {
    return await db.models.Otp.update(record, query);
  }

  async delete(query: DestroyOptions) {
    return await db.models.Otp.destroy(query);
  }
}

export default OtpDao;