import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ProductAttributes {
  id: string;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  store_id: number;
  active?: boolean;
  metadata?: Record<string, unknown> | null;
}

export type ProductCreationAttributes = Optional<ProductAttributes, "id">;

const Product: ModelDefined<ProductAttributes, ProductCreationAttributes> = sequelize.define(
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

export default Product;
