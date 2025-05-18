import { QueryInterface, DataTypes } from "sequelize";
import { TransactionStatus, TransactionTypes } from "../../typings/enums";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Transaction", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      account_id: {
        type: DataTypes.UUID,
      },
      loan_id: {
        type: DataTypes.UUID,
      },
      repayment_id: {
        type: DataTypes.UUID,
      },
      amount: {
        type: DataTypes.DECIMAL(30, 2),
      },
      fee: {
        type: DataTypes.DECIMAL(30, 2),
      },
      status: {
        type: DataTypes.ENUM(
          TransactionStatus.PENDING,
          TransactionStatus.SUCCESS,
          TransactionStatus.FAILED,
        ),
      },
      type: {
        type: DataTypes.ENUM(
          TransactionTypes.LOAN,
          TransactionTypes.REPAYMENT,
          TransactionTypes.FEE,
        ),
      },
      metadata: {
        type: DataTypes.JSON,
      },
      reference: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Transaction");
  },
}