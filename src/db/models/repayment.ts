import sequelize from "../init";
import { ModelInstances } from "./types";
import { DataTypes, Model, Optional } from "sequelize";
import { RepaymentStatus } from "../../typings/enums";
import { RepaymentAttributes } from "../../typings/repayment";

export interface RepaymentCreationAttributes extends Optional<RepaymentAttributes, "id"| "createdAt" | "updatedAt"> {}
class Repayment extends Model<RepaymentAttributes, RepaymentCreationAttributes> implements RepaymentAttributes {
  public id!: string;
  public loan_id!: string;
  public amount_due!: number;
  public date_paid!: Date;
  public status!: RepaymentStatus;
  public amount_paid!: number;
  public repayment_amount!: number;
  public due_date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Helper method for defining associations.
   * This method is not a part of the Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: ModelInstances) {

  }
}

Repayment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loan_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: DataTypes.ENUM(RepaymentStatus.PENDING, RepaymentStatus.LATE, RepaymentStatus.PAID),
  amount_paid: DataTypes.DECIMAL(30, 2),
  amount_due: DataTypes.DECIMAL(30, 2),
  repayment_amount: DataTypes.DECIMAL(30, 2),
  date_paid: DataTypes.DATE,
  due_date: DataTypes.DATE,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Repayment',
  freezeTableName: true,
});

export default Repayment;
