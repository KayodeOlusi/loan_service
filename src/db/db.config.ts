import dotenv from "dotenv";
import { Dialect } from "sequelize";
dotenv.config();

type DBConfigType = {
  development: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    logging: boolean;
  };
  test: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    logging: boolean;
  };
  production: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    logging: boolean;
  };
};

const config: DBConfigType = {
  development: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: "",
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: "root",
    password: "",
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
};

export default config;
