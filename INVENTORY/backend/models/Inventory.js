const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")  
const Product = require("./Product")

const Inventory = sequelize.define(
  "Inventory",
  {
    inventoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "inventoryid",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "productid",
      references: {
        model: Product,
        key: "productid",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updatedat",
    },
  },
  {
    tableName: "inventory",
    timestamps: true,
  },
)

// Define associations
Inventory.belongsTo(Product, { foreignKey: "productId" })

module.exports = Inventory
