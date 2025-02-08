import { AccountDao } from "../dao";
import { FindOptions } from "sequelize";
import { autoInjectable } from "tsyringe";
import { Exception } from "../../lib/errors";
import { AccountStatus } from "../../typings/enums";
import { AccountAttributes, AccountCreationBody } from "../../typings/account";

@autoInjectable()
class AccountService {
  private AccountDAO: AccountDao;

  constructor(_accountDao: AccountDao) {
    this.AccountDAO = _accountDao;
  }

  private async generateAccountNumber() {
    try {
      while (true) {
        const accNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const accountExists = await this.AccountDAO.fetchOne({
          where: { account_number: accNumber },
        });

        if (!accountExists) return accNumber;
      }
    } catch (error) {
      throw new Exception("Error generating account number. Please try again later.");
    }
  }

  private async createNewAccountRecord(user_id: string) {
    try {
      const account_number = await this.generateAccountNumber();
      return {
        user_id,
        balance: 0,
        status: AccountStatus.ACTIVE,
        account_number,
      }
    } catch (e) {
      throw e;
    }
  }

  async getAccountById(id: string) {
    return await this.AccountDAO.fetchOne({
      where: { id }
    });
  }

  async getAccountByField(query: Partial<AccountAttributes>, opts?: FindOptions) {
    return await this.AccountDAO.fetchOne({
      where: { ...query },
      ...opts
    });
  }

  async createAccount(user_id: string) {
    try {
      let account: AccountCreationBody = await this.createNewAccountRecord(user_id);
      return await this.AccountDAO.create(account as AccountAttributes);
    } catch (e) {
      throw e;
    }
  }

  async getAccounts(opts?: FindOptions) {
    try {
      return await this.AccountDAO.fetchAll(opts);
    } catch (e) {
      throw e;
    }
  }

  async getAccount(query: Partial<AccountAttributes>, opts?: FindOptions) {
    try {
      return await this.AccountDAO.fetchOne({
        where: { ...query },
        ...opts
      });
    } catch (e) {
      throw e;
    }
  }
}

export default AccountService;