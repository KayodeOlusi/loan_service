import sequelize from "./init";
import { User, Otp, Account } from "./models";

const models = {
  User,
  Account,
  Otp
}


const db = {
  sequelize,
  models
}

export { models };
export default db;