import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Transaction", {

    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Transaction");
  }
}