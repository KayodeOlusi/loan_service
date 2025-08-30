import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface)=> {
    await queryInterface.removeColumn("Loan", "tenure_months")
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Loan", "tenure_months", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
  }
}