"use strict";
import sequelize from "../init";
import { UserAttributes } from "../../typings/user";
import { AccountStatus } from "../../typings/enums";
import { Model, DataTypes, Optional } from 'sequelize';

export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare password: string;
  declare account_status: AccountStatus;
  declare phone_number: string;
  declare is_verified: boolean;

  declare readonly updatedAt: Date;
  declare readonly createdAt: Date;
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: any) {
    // define association here
  }
}

User.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  account_status: DataTypes.ENUM(AccountStatus.ACTIVE, AccountStatus.SUSPENDED),
  password: DataTypes.STRING,
  is_verified: DataTypes.BOOLEAN,
  phone_number: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: sequelize,
  modelName: 'User',
});

export default User;
