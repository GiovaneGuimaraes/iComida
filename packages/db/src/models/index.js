const sequelize = require("../config/database");
const Store = require("./Store");
const Product = require("./Product");
const User = require("./User");

// Associations
Store.hasMany(Product, { foreignKey: "store_id", onDelete: "CASCADE" });
Product.belongsTo(Store, { foreignKey: "store_id" });

User.hasMany(Store, { foreignKey: "user_id" });
Store.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  Store,
  Product,
  User,
};
