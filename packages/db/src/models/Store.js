const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "stores",
  }
);

module.exports = Store;
