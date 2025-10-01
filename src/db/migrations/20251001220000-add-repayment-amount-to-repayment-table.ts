import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Repayment", "repayment_amount", {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Repayment", "repayment_amount");
  }
}
