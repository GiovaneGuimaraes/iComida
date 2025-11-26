import { sequelize } from "./db";
import * as models from "./models";

(async () => {
  try {
    models;
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export { sequelize };
