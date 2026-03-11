const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "users",
  }
);

module.exports = User;
