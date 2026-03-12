import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../config/database";

export interface UserAttributes {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  billing_address?: Record<string, unknown> | null;
  payment_method?: Record<string, unknown> | null;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;

const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define(
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

export default User;
