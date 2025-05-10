const Category = require("../models/Category")

// Using module.exports instead of export
module.exports = {
  // Create a new category
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body

      // Check if category already exists
      const existingCategory = await Category.findOne({ where: { name } })

      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" })
      }

      // Create new category
      const category = await Category.create({
        name,
        description,
      })

      res.status(201).json({
        message: "Category created successfully",
        category,
      })
    } catch (error) {
      res.status(500).json({ message: "Error creating category", error: error.message })
    }
  },

  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll()

      res.status(200).json(categories)
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories", error: error.message })
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params

      const category = await Category.findByPk(id)

      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }

      res.status(200).json(category)
    } catch (error) {
      res.status(500).json({ message: "Error fetching category", error: error.message })
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params
      const { name, description } = req.body

      const category = await Category.findByPk(id)

      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }

      // Update category fields
      if (name) category.name = name
      if (description !== undefined) category.description = description

      await category.save()

      res.status(200).json({
        message: "Category updated successfully",
        category,
      })
    } catch (error) {
      res.status(500).json({ message: "Error updating category", error: error.message })
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params

      const category = await Category.findByPk(id)

      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }

      await category.destroy()

      res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error: error.message })
    }
  }
}
