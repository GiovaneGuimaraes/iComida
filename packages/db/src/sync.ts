import db = require("./models");

const { sequelize } = db;

async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Sync failed:", error);
    process.exitCode = 1;
  }
}

void syncDatabase();
