const Product = require("../models/Product")
const Category = require("../models/Category")
const Inventory = require("../models/Inventory")
const { sequelize } = require("../config/database")

const createProduct = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { name, sku, description, categoryId, price, minimumStock, initialInventory } = req.body

    const existingProduct = await Product.findOne({
      where: { sku },
      transaction,
    })

    if (existingProduct) {
      await transaction.rollback()
      return res.status(400).json({ message: "Product with this SKU already exists" })
    }

    const category = await Category.findByPk(categoryId, { transaction })

    if (!category) {
      await transaction.rollback()
      return res.status(404).json({ message: "Category not found" })
    }

    const product = await Product.create(
      {
        name,
        sku,
        description,
        categoryId,
        price,
        minimumStock,
      },
      { transaction },
    )

    await Inventory.create(
      {
        productId: product.productId,
        quantity: initialInventory || 0, // Use initialInventory if provided, otherwise default to 0
      },
      { transaction },
    )

    await transaction.commit()

    res.status(201).json({
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ message: "Error creating product", error: error.message })
  }
}

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["categoryId", "name"],
        },
        {
          model: Inventory,
          attributes: ["quantity"],
        },
      ],
    })

    // Transform the data to match frontend expectations
    const transformedProducts = products.map(product => {
      const plainProduct = product.get({ plain: true });
      return {
        _id: plainProduct.productId, // Map productId to _id for frontend
        name: plainProduct.name,
        sku: plainProduct.sku,
        description: plainProduct.description,
        price: plainProduct.price,
        minimumStock: plainProduct.minimumStock,
        inventory: {
          currentStock: plainProduct.Inventory ? plainProduct.Inventory.quantity : 0
        },
        category: {
          _id: plainProduct.categoryId,
          name: plainProduct.Category ? plainProduct.Category.name : 'Uncategorized'
        }
      };
    });

    res.status(200).json(transformedProducts)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message })
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: Inventory,
          attributes: ["quantity"],
        },
      ],
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, categoryId, price, minimumStock } = req.body

    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId)
      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }
    }

    if (name) product.name = name
    if (description !== undefined) product.description = description
    if (categoryId) product.categoryId = categoryId
    if (price) product.price = price
    if (minimumStock !== undefined) product.minimumStock = minimumStock

    await product.save()

    res.status(200).json({
      message: "Product updated successfully",
      product,
    })
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params

    const product = await Product.findByPk(id, { transaction })

    if (!product) {
      await transaction.rollback()
      return res.status(404).json({ message: "Product not found" })
    }

    await Inventory.destroy({
      where: { productId: id },
      transaction,
    })

    await product.destroy({ transaction })

    await transaction.commit()

    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ message: "Error deleting product", error: error.message })
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
}
