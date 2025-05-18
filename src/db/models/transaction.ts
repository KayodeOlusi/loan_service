import sequelize from "../init";
import { ModelInstances } from "./types";
import { DataTypes, Model, Optional } from "sequelize";
import { TransactionAttributes } from "../../typings/transaction";
import { TransactionStatus, TransactionTypes } from "../../typings/enums";

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id" | "createdAt" | "updatedAt"> {
}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: string;
  public user_id!: string;
  public account_id!: string;
  public loan_id!: string;
  public amount!: number;
  public fee!: number;
  public status!: TransactionStatus;
  public type!: TransactionTypes;
  public repayment_id!: string;
  public reference!: string;
  public metadata!: Record<string, any>;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  /**
   * Helper method for defining associations.
   * This method is not a part of the Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(model: ModelInstances) {
    // define association here
  }
}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
  account_id: DataTypes.UUID,
  loan_id: DataTypes.UUID,
  repayment_id: DataTypes.UUID,
  amount: DataTypes.DECIMAL(30, 2),
  fee: DataTypes.DECIMAL(30, 2),
  status: DataTypes.ENUM(
    TransactionStatus.PENDING,
    TransactionStatus.SUCCESS,
    TransactionStatus.FAILED,
  ),
  type: DataTypes.ENUM(
    TransactionTypes.LOAN,
    TransactionTypes.REPAYMENT,
    TransactionTypes.FEE,
  ),
  metadata: DataTypes.JSON,
  reference: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Transaction',
  freezeTableName: true
});

export default Transaction;
