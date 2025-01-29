import { Sequelize } from "sequelize";
import dbConfig from "./db.config";

const env = (process.env.NODE_ENV || "development") as keyof typeof dbConfig;
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  logging: config.logging,
});

export default sequelize;
