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
    port: any;
  };
  test: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    logging: boolean;
    port: any;
  };
  production: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    logging: boolean;
    port: any;
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
    port: Number(process.env.DB_PORT),
  },
  test: {
    username: process.env.TEST_USER as string,
    password: process.env.TEST_PASSWORD as string,
    database: process.env.TEST_DB_NAME as string,
    host: process.env.TEST_HOST as string,
    dialect: "mysql",
    logging: false,
    port: Number(process.env.TEST_DB_PORT),
  },
  production: {
    username: "root",
    password: "",
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
    port: 3306,
  },
};

export default config;
