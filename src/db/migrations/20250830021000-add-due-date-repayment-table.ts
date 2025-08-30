import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface)=> {
    await queryInterface.addColumn("Repayment", "due_date", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Repayment", "due_date");
  }
}
