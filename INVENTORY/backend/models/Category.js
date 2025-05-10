const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")  
const Category = sequelize.define(
  "Category",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "categoryid",
    },
    name: {
      type: DataTypes.STRING(100),
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
    tableName: "categories",
    timestamps: true,
  },
)

module.exports = Category
