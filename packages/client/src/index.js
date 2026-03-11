const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env.Staging"),
});

const storeRoutes = require("./routes/stores");
const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

function startServer() {
  const port = process.env.PORT || 3001;
  const { sequelize } = require("db");

  sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`REST API running on port ${port}`);
    });
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
