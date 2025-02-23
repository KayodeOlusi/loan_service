'use strict';
import {
  Model,
  DataTypes, Optional,
} from "sequelize";
import sequelize from "../init";
import { AccountStatus } from "../../typings/enums";
import { AccountAttributes } from "../../typings/account";
import { ModelInstances } from "./types";

export interface AccountCreationAttributes extends Optional<AccountAttributes, "id" | "createdAt" | "updatedAt"> {}
class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: string;
  public balance!: number;
  public user_id!: string;
  public status!: AccountStatus;
  public account_number!: string;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: ModelInstances) {
    // define association here
    // Account.belongsTo(models.User, {
    //   foreignKey: "user_id"
    // });
  }
}

Account.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: DataTypes.UUID,
  balance: DataTypes.DECIMAL(30, 2),
  status: DataTypes.ENUM("ACTIVE", "SUSPENDED"),
  createdAt: DataTypes.DATE,
  account_number: DataTypes.STRING,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Account',
  freezeTableName: true
});

export default Account;


