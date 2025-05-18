import { QueryInterface, DataTypes } from "sequelize";
import { LoanRepaymentFrequency, LoanStatus } from "../../typings/enums";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Loan", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
      },
      tenure_months: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      interest_rate: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          LoanStatus.PENDING,
          LoanStatus.APPROVED,
          LoanStatus.REJECTED,
          LoanStatus.DISBURSED,
          LoanStatus.PAID_OFF
        ),
        defaultValue: LoanStatus.PENDING,
      },
      repayment_frequency: {
        type: DataTypes.ENUM(
          LoanRepaymentFrequency.WEEKLY,
          LoanRepaymentFrequency.BI_WEEKLY,
          LoanRepaymentFrequency.MONTHLY,
          LoanRepaymentFrequency.QUARTERLY,
          LoanRepaymentFrequency.YEARLY
        ),
        defaultValue: LoanRepaymentFrequency.MONTHLY
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Loan");
  }
}