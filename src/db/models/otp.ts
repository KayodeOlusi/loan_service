'use strict';
import {
  DataTypes,
  Model
} from "sequelize";
import sequelize from "../init";
import { OtpTypes } from "../../typings/enums";
import { OtpAttributes } from "../../typings/otp";


class Otp extends Model<OtpAttributes> implements OtpAttributes {
  public id!: string;
  public user_id!: string;
  public expires_at!: Date;
  public code!: string;
  public type!: OtpTypes;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: any) {
    // define association here
  }
}

Otp.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: DataTypes.STRING,
  type: DataTypes.ENUM("VERIFY_EMAIL", "FORGOT_PASSWORD", "RESET_PASSWORD", "CHANGE_PASSWORD"),
  code: DataTypes.STRING,
  expires_at: DataTypes.DATE,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Otp',
});

export default Otp;