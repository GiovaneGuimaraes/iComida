import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    roles: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    cellphone: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "User" }
);
