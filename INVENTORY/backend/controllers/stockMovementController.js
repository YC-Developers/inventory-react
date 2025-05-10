const StockMovement = require("../models/StockMovement")
const Product = require("../models/Product")
const User = require("../models/User")

// Get all stock movements
const getAllStockMovements = async (req, res) => { 
  try {
    const stockMovements = await StockMovement.findAll({
      include: [
        {
          model: Product,
          attributes: ["name", "sku"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.status(200).json(stockMovements)
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock movements", error: error.message })
  }
}

// Get stock movements for a specific product
const getProductStockMovements = async (req, res) => {
  try {
    const { productId } = req.params

    const stockMovements = await StockMovement.findAll({
      where: { productId },
      include: [
        {
          model: Product,
          attributes: ["name", "sku"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    res.status(200).json(stockMovements)
  } catch (error) {
    res.status(500).json({ message: "Error fetching product stock movements", error: error.message })
  }
}

// Get stock movement by ID
const getStockMovementById = async (req, res) => {
  try {
    const { id } = req.params

    const stockMovement = await StockMovement.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ["name", "sku"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    })

    if (!stockMovement) {
      return res.status(404).json({ message: "Stock movement not found" })
    }

    res.status(200).json(stockMovement)
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock movement", error: error.message })
  }
}

// Get all products for stock movement form
const getProductsForStockMovement = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "name", "sku"], // Make sure to include the ID field
      where: { isActive: true }, // Only get active products
      order: [["name", "ASC"]], // Order by name
    })

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message })
  }
}

// Create a new stock movement
const createStockMovement = async (req, res) => {
  try {
    const { productId, type, quantity, date, reference, notes } = req.body
    // If you have authentication, get the user ID from the request
    // const userId = req.user.id 
    const userId = 1 // Temporary default if no auth system is in place

    // Validate required fields
    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: "Product, type, and quantity are required" })
    }

    // Create the stock movement
    const stockMovement = await StockMovement.create({
      productId,
      userId,
      type,
      quantity,
      date: date || new Date(),
      reference,
      notes
    })

    // Update the product stock quantity
    const product = await Product.findByPk(productId)
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Update stock based on movement type
    if (type === 'in') {
      product.stockQuantity = (product.stockQuantity || 0) + parseInt(quantity)
    } else if (type === 'out') {
      // Check if there's enough stock
      if ((product.stockQuantity || 0) < parseInt(quantity)) {
        return res.status(400).json({ message: "Not enough stock available" })
      }
      product.stockQuantity = (product.stockQuantity || 0) - parseInt(quantity)
    }

    await product.save()

    // Return the created movement with product details
    const createdMovement = await StockMovement.findByPk(stockMovement.id, {
      include: [
        {
          model: Product,
          attributes: ["name", "sku"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    })

    res.status(201).json(createdMovement)
  } catch (error) {
    res.status(500).json({ message: "Error creating stock movement", error: error.message })
  }
}

module.exports = {
  getAllStockMovements,
  getProductStockMovements,
  getStockMovementById,
  getProductsForStockMovement,
  createStockMovement
}
