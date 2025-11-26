import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("icomida", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});
