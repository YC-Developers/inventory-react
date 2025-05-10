const User = require("./User")
const Category = require("./Category")
const Product = require("./Product")
const Inventory = require("./Inventory")
const StockMovement = require("./StockMovement")

// Define associations
Category.hasMany(Product, { foreignKey: "categoryId" })
Product.belongsTo(Category, { foreignKey: "categoryId" })

Product.hasOne(Inventory, { foreignKey: "productId" })
Inventory.belongsTo(Product, { foreignKey: "productId" })

Product.hasMany(StockMovement, { foreignKey: "productId" })
StockMovement.belongsTo(Product, { foreignKey: "productId" })

User.hasMany(StockMovement, { foreignKey: "userId" })
StockMovement.belongsTo(User, { foreignKey: "userId" })

module.exports = { User, Category, Product, Inventory, StockMovement }
