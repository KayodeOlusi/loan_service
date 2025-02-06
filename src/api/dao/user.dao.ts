import db from "../../db";
import { UserCreationAttributes } from "../../db/models/user";
import { FindOptions, UpdateOptions, DestroyOptions } from "sequelize";

class UserDao {
  constructor() {
  }

  async fetchOne(query: FindOptions) {
    return await db.models.User.findOne(query);
  }

  async fetchOneWithAllAttributes(query: FindOptions) {
    return await db.models.User.scope("withPassword").findOne(query);
  }

  async fetchAll(query: FindOptions) {
    return await db.models.User.findAll(query);
  }

  async fetchByPk(key: string) {
    return await db.models.User.findByPk(key);
  }
  
  async create(record: UserCreationAttributes) {
    return await db.models.User.create(record);
  }

  async updateOne(record: Partial<UserCreationAttributes>, query: UpdateOptions) {
    return await db.models.User.update(record, query);
  }

  async delete(query: DestroyOptions) {
    return await db.models.User.destroy(query);
  }
}

export default UserDao;