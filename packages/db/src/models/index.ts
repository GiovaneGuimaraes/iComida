import sequelize from "../config/database";
import Product from "./Product";
import Store from "./Store";
import User from "./User";

Store.hasMany(Product, { foreignKey: "store_id", onDelete: "CASCADE" });
Product.belongsTo(Store, { foreignKey: "store_id" });

User.hasMany(Store, { foreignKey: "user_id" });
Store.belongsTo(User, { foreignKey: "user_id" });

const db = {
  sequelize,
  Store,
  Product,
  User,
};

export = db;
