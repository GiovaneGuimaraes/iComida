import path from "node:path";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({
  path: path.resolve(__dirname, "../../.env.Staging"),
});

const sequelize = new Sequelize(
  process.env.DB_NAME || "icomida",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "root",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    dialect: (process.env.DB_DIALECT as "mysql") || "mysql",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
);

export default sequelize;
