import { UserDao } from "../dao";
import { autoInjectable } from "tsyringe";
import { FindOptions } from "sequelize";
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

  async createUser(user: UserCreationBody) {
    let record = user as UserAttributes;
    return await this.UserDAO.create(record);
  }
}

export default UserService;