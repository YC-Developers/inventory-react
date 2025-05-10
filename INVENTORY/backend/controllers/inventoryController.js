const Inventory = require("../models/Inventory") 
const Product = require("../models/Product") 
const StockMovement = require("../models/StockMovement") 
const sequelize = require("../config/database") 

// Get inventory for all products
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({
      include: [
        {
          model: Product,
          attributes: ["name", "sku", "price", "minimumStock"],
        },
      ],
    })

    res.status(200).json(inventory)
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error: error.message })
  }
}

// Get inventory for a specific product
const getProductInventory = async (req, res) => {
  try {
    const { productId } = req.params

    const inventory = await Inventory.findOne({
      where: { productId },
      include: [
        {
          model: Product,
          attributes: ["name", "sku", "price", "minimumStock"],
        },
      ],
    })

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found for this product" })
    }

    res.status(200).json(inventory)
  } catch (error) {
    res.status(500).json({ message: "Error fetching product inventory", error: error.message })
  }
}

// Update inventory (add or remove stock)
const updateInventory = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { productId } = req.params
    const { quantity, type, notes } = req.body
    const userId = req.user.userId

    // Validate input
    if (!["add", "remove"].includes(type)) {
      await transaction.rollback()
      return res.status(400).json({ message: "Type must be either \"add\" or \"remove\"" })
    }

    if (!quantity || quantity <= 0) {
      await transaction.rollback()
      return res.status(400).json({ message: "Quantity must be a positive number" })
    }

    // Find product and inventory
    const product = await Product.findByPk(productId, { transaction })

    if (!product) {
      await transaction.rollback()
      return res.status(404).json({ message: "Product not found" })
    }

    let inventory = await Inventory.findOne({
      where: { productId },
      transaction,
    })

    if (!inventory) {
      // Create inventory record if it does not exist
      inventory = await Inventory.create(
        {
          productId,
          quantity: 0,
        },
        { transaction },
      )
    }

    // Calculate new quantity
    let newQuantity
    if (type === "add") {
      newQuantity = inventory.quantity + quantity
    } else {
      // Check if there is enough stock to remove
      if (inventory.quantity < quantity) {
        await transaction.rollback()
        return res.status(400).json({ message: "Not enough stock available" })
      }
      newQuantity = inventory.quantity - quantity
    }

    // Update inventory
    inventory.quantity = newQuantity
    await inventory.save({ transaction })

    // Create stock movement record
    const movementQuantity = type === "add" ? quantity : -quantity
    await StockMovement.create(
      {
        productId,
        quantity: movementQuantity,
        type,
        notes,
        userId,
      },
      { transaction },
    )

    await transaction.commit()

    res.status(200).json({
      message: "Inventory updated successfully",
      inventory: {
        productId,
        quantity: newQuantity,
        previousQuantity: type === "add" ? newQuantity - quantity : newQuantity + quantity,
      },
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ message: "Error updating inventory", error: error.message })
  }
}

module.exports = {
  getAllInventory,
  getProductInventory,
  updateInventory
}
