import sequelize from "./init";
import { User, Otp, Account } from "./models";


const db = {
  sequelize,
  models: {
    User,
    Account,
    Otp
  }
}

export default db;