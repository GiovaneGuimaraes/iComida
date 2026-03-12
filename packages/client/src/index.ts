import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import db = require("db");
import productsRouter from "./routes/products";
import storesRouter from "./routes/stores";

const { sequelize } = db;

dotenv.config({
  path: path.resolve(__dirname, "../.env.Staging"),
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/stores", storesRouter);
app.use("/api/products", productsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  const port = process.env.PORT || 3001;

  await sequelize.sync();

  app.listen(port, () => {
    console.log(`REST API running on port ${port}`);
  });
}

if (require.main === module) {
  void startServer();
}

type AppWithStartServer = typeof app & {
  startServer: typeof startServer;
};

const exportedApp = app as AppWithStartServer;
exportedApp.startServer = startServer;

export = exportedApp;
