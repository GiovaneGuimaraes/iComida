import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar_url?: string | null;
  billing_address?: Record<string, unknown> | null;
  payment_method?: Record<string, unknown> | null;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;

const User: ModelDefined<UserAttributes, UserCreationAttributes> =
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
  );

export default User;
