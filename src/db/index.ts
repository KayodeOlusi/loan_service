import sequelize from "./init";
import { User, Otp, Account, Loan, Transaction, Repayment } from "./models";

const models = {
  User,
  Account,
  Otp,
  Loan,
  Transaction,
  Repayment,
}


const db = {
  sequelize,
  models
}

export { models };
export default db;
