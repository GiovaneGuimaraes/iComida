const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "products",
  }
);

module.exports = Product;
