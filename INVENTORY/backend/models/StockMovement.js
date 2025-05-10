const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/database")  
const Product = require("./Product")
const User = require("./User")

const StockMovement = sequelize.define(
  "StockMovement",
  {
    movementId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "movementid",
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
      validate: {
        notZero(value) {
          if (value === 0) {
            throw new Error("Quantity cannot be zero")
          }
        },
      },
    },
    type: {
      type: DataTypes.ENUM("add", "remove"),
      allowNull: false,
      validate: {
        isIn: [["add", "remove"]],
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userid",
      references: {
        model: User,
        key: "userid",
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
    tableName: "stockmovements",
    timestamps: true,
  },
)

StockMovement.belongsTo(Product, { foreignKey: "productId" })
StockMovement.belongsTo(User, { foreignKey: "userId" })

module.exports = StockMovement