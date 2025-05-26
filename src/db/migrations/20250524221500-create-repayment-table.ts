import { DataTypes, QueryInterface } from "sequelize";
import { RepaymentStatus } from "../../typings/enums";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Repayment", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      loan_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      amount_due: DataTypes.DECIMAL(30, 2),
      status: DataTypes.ENUM(RepaymentStatus.PENDING, RepaymentStatus.LATE, RepaymentStatus.PAID),
      amount_paid: DataTypes.DECIMAL(30, 2),
      date_paid: DataTypes.DATE,
      due_date: DataTypes.DATE,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Repayment");
  }
}