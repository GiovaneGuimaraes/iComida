import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../config/database";

export interface StoreAttributes {
  id: number;
  name?: string | null;
  image_path?: string | null;
  category?: string | null;
  active?: boolean;
  user_id?: string | null;
}

export type StoreCreationAttributes = Optional<StoreAttributes, "id">;

const Store: ModelDefined<StoreAttributes, StoreCreationAttributes> = sequelize.define(
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

export default Store;
