const { sequelize } = require("../config/database")
const Product = require("../models/Product")
const Inventory = require("../models/Inventory")
const StockMovement = require("../models/StockMovement")
const { literal, QueryTypes } = require("sequelize")

// Get low stock items
const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Product.findAll({
      include: [
        {
          model: Inventory,
          required: true,
          where: literal("Inventory.quantity <= Product.minimumStock"),
        },
      ],
    })

    res.status(200).json(lowStockItems)
  } catch (error) {
    res.status(500).json({ message: "Error fetching low stock items", error: error.message })
  }
}

// Get total inventory value
const getTotalInventoryValue = async (req, res) => {
  try {
    const result = await Inventory.findAll({
      include: [
        {
          model: Product,
          attributes: ["price"],
        },
      ],
      attributes: ["quantity", [literal("quantity * Product.price"), "value"]],
      raw: true,
    })

    const totalValue = result.reduce((sum, item) => sum + Number.parseFloat(item.value), 0)

    res.status(200).json({
      totalValue: totalValue.toFixed(2),
      items: result,
    })
  } catch (error) {
    res.status(500).json({ message: "Error calculating inventory value", error: error.message })
  }
}


// Get inventory summary
const getInventorySummary = async (req, res) => {
  try {
    const totalProducts = await Product.count()
    const totalCategories = await sequelize.query("SELECT COUNT(DISTINCT categoryId) as count FROM products", {
      type: QueryTypes.SELECT,
    })

    const lowStockCount = await Product.count({
      include: [
        {
          model: Inventory,
          required: true,
          where: literal("Inventory.quantity <= Product.minimumStock"),
        },
      ],
    })

    const outOfStockCount = await Product.count({
      include: [
        {
          model: Inventory,
          required: true,
          where: { quantity: 0 },
        },
      ],
    })

    const recentMovements = await StockMovement.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["name"],
        },
      ],
    })

    res.status(200).json({
      totalProducts,
      totalCategories: totalCategories[0].count,
      lowStockItems: lowStockCount, // Changed to match frontend expectation
      recentMovements: recentMovements.length, // Changed to match frontend expectation
      outOfStockCount,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory summary", error: error.message })
  }
}

// Get recent stock movements
const getRecentMovements = async (req, res) => {
  try {
    const recentMovements = await StockMovement.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["name"],
        },
      ],
    })

    res.status(200).json(recentMovements)
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent movements", error: error.message })
  }
}

// Add this to the exports
module.exports = {
  getLowStockItems,
  getTotalInventoryValue,
  getInventorySummary,
  getRecentMovements
}
