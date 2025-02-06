import { UserDao } from "../dao";
import { autoInjectable } from "tsyringe";
import { FindOptions, UpdateOptions } from "sequelize";
import { UserAttributes, UserCreationBody } from "../../typings/user";

@autoInjectable()
class UserService {
  private UserDAO: UserDao;

  constructor(_userDao: UserDao) {
    this.UserDAO = _userDao;
  }

  async getUserByField(record: Partial<UserAttributes>, opts?: FindOptions) {
    return await this.UserDAO.fetchOne({
      where: { ...record },
      ...opts
    });
  }

  async getUserWithAllAttributes(record: Partial<UserAttributes>, opts?: FindOptions) {
    return await this.UserDAO.fetchOneWithAllAttributes({
      where: { ...record },
      ...opts
    });
  }

  async find(opts: FindOptions) {
    return await this.UserDAO.fetchOneWithAllAttributes({
      ...opts
    });
  }

  async createUser(user: UserCreationBody) {
    let record = user as UserAttributes;
    return await this.UserDAO.create(record);
  }

  async update(record: Partial<UserAttributes>, opts: UpdateOptions) {
    return await this.UserDAO.updateOne(record, opts);
  }
}

export default UserService;