"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { productService, categoryService } from "../../services/api"
import { Save, X } from "lucide-react"

export default function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    categoryId: "",
    minimumStock: "",
    initialInventory: "0", 
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll()
        // Ensure categories is always an array
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again.")
        // Set categories to empty array on error
        setCategories([])
      }
    }

    const fetchProduct = async () => {
      if (isEditMode) {
        try {
          setLoading(true)
          const product = await productService.getById(id)

          setFormData({
            name: product.name || "",
            sku: product.sku || "",
            description: product.description || "",
            price: product.price || "",
            categoryId: product.categoryId || "",
            minimumStock: product.minimumStock || "",
            // No initialInventory for edit mode as it's managed separately
          })

          setLoading(false)
        } catch (err) {
          console.error("Error fetching product:", err)
          setError("Failed to load product data. Please try again.")
          setLoading(false)
        }
      }
    }

    fetchCategories()
    fetchProduct()
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      // Format data to match backend expectations
      const productData = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        categoryId: formData.categoryId,
        minimumStock: Number.parseInt(formData.minimumStock, 10),
      }

      // Only include initialInventory for new products
      if (!isEditMode && formData.initialInventory) {
        productData.initialInventory = Number.parseInt(formData.initialInventory, 10)
      }

      if (isEditMode) {
        await productService.update(id, productData)
      } else {
        await productService.create(productData)
      }

      navigate("/products")
    } catch (err) {
      console.error("Error saving product:", err)
      setError("Failed to save product. Please try again.")
      setLoading(false)
    }
  }

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <X className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Product Details */}
            <div className="sm:col-span-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Product Details</h2>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm bg-green-100 focus:rign-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="sku"
                  id="sku"
                  required
                  value={formData.sku}
                  onChange={handleChange}
                  className="shadow-sm bg-green-100 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm bg-green-100 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">RWF</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">RWF</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="shadow-sm bg-green-100 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Select a category</option>
                  {/* Ensure categories is an array before mapping */}
                  {Array.isArray(categories) && categories.map((category) => (
                    <option key={category._id || category.categoryId} value={category._id || category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700">
                Minimum Stock Level
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="minimumStock"
                  id="minimumStock"
                  min="0"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  className="shadow-sm bg-green-100 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Alert will be shown when stock falls below this level</p>
            </div>

            {/* Initial Inventory - Only show for new products */}
            {!isEditMode && (
              <div className="sm:col-span-2">
                <label htmlFor="initialInventory" className="block text-sm font-medium text-gray-700">
                  Initial Inventory
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="initialInventory"
                    id="initialInventory"
                    min="0"
                    value={formData.initialInventory}
                    onChange={handleChange}
                    className="shadow-sm bg-green-100 focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Initial quantity in stock</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
