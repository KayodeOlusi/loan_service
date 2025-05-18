import sequelize from "./init";
import { User, Otp, Account, Loan, Transaction } from "./models";

const models = {
  User,
  Account,
  Otp,
  Loan,
  Transaction
}


const db = {
  sequelize,
  models
}

export { models };
export default db;