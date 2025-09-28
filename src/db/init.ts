import { Sequelize } from "sequelize";
import dbConfig from "./db.config";

const env = (process.env.NODE_ENV || "development") as keyof typeof dbConfig;
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  logging: config.logging,
  host: config.host,
  port: config.port,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;
