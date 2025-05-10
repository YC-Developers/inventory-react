const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")  
const Category = require("./Category")

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "productid",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "categoryid",
      references: {
        model: Category,
        key: "categoryid",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    minimumStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "minimumstock",
      validate: {
        min: 0,
      },
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "imageurl",
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
    tableName: "products",
    timestamps: true,
  },
)

// Define associations
Product.belongsTo(Category, { foreignKey: "categoryId" })

module.exports = Product
