import sequelize from "../init";
import { ModelInstances } from "./types";
import { LoanAttributes } from "../../typings/loan";
import { DataTypes, Model, Optional } from "sequelize";
import { LoanRepaymentFrequency, LoanStatus } from "../../typings/enums";

export interface LoanCreationAttributes extends Optional<LoanAttributes, "id" | "createdAt" | "updatedAt"> {
}

class Loan extends Model<LoanAttributes, LoanCreationAttributes> implements LoanAttributes {
  public id!: string;
  public user_id!: string;
  public amount!: number;
  public interest_rate!: number;
  public status!: LoanStatus;
  public tenure_months!: number;
  public repayment_frequency!: LoanRepaymentFrequency;
  public purpose!: string;
  public start_date!: Date;
  public end_date!: Date;

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

Loan.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: DataTypes.UUID,
  purpose: DataTypes.STRING,
  amount: DataTypes.DECIMAL(30, 2),
  tenure_months: DataTypes.INTEGER,
  interest_rate: DataTypes.DECIMAL(30, 2),
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  status: DataTypes.ENUM(
    LoanStatus.PENDING,
    LoanStatus.APPROVED,
    LoanStatus.REJECTED,
    LoanStatus.DISBURSED,
    LoanStatus.PAID_OFF
  ),
  repayment_frequency: DataTypes.ENUM(
    LoanRepaymentFrequency.WEEKLY,
    LoanRepaymentFrequency.BI_WEEKLY,
    LoanRepaymentFrequency.MONTHLY,
    LoanRepaymentFrequency.QUARTERLY,
    LoanRepaymentFrequency.YEARLY
  ),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelize,
  modelName: 'Loan',
  freezeTableName: true
});
