"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { stockMovementService, productService } from "../../services/api"
import { Save, X, TrendingUp, TrendingDown } from "lucide-react"

export default function StockMovementForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [formData, setFormData] = useState({
    productId: queryParams.get("product") || "",
    type: queryParams.get("type") || "in",
    quantity: "",
    date: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  })

  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        
        // Use the API service with the correct endpoint
        const response = await productService.getAll()
        console.log("Products API response:", response)
        
        // Check if response is valid
        if (response && Array.isArray(response)) {
          setProducts(response)
        } else {
          console.warn("Invalid products data format:", response)
          setProducts([])
          setError("Received invalid product data from server")
        }
        
        setProductsLoading(false)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(`Failed to load products: ${err.message}. Please try again.`)
        setProducts([])
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.productId) {
      setError("Please select a product")
      return
    }

    if (!formData.quantity || formData.quantity <= 0) {
      setError("Please enter a valid quantity")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const movementData = {
        ...formData,
        quantity: Number.parseInt(formData.quantity, 10),
      }

      await stockMovementService.create(movementData)

      navigate("/stock-movements")
    } catch (err) {
      console.error("Error creating stock movement:", err)
      setError("Failed to create stock movement. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">New Stock Movement</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate("/stock-movements")}
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
            {loading ? "Saving..." : "Save Movement"}
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
            <div className="sm:col-span-3">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                Product *
              </label>
              <div className="mt-1">
                <select
                  id="productId"
                  name="productId"
                  required
                  value={formData.productId}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  disabled={productsLoading}
                >
                  <option value="">Select a product</option>
                  {productsLoading ? (
                    <option value="" disabled>Loading products...</option>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <option 
                        key={product.id || product.productId} 
                        value={product.id || product.productId}
                      >
                        {product.name} ({product.sku})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No products available</option>
                  )}
                </select>
                {!productsLoading && products.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    No products found. Please add products first.
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Movement Type *
              </label>
              <div className="mt-1">
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="in"
                      checked={formData.type === "in"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
                      Stock In
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="out"
                      checked={formData.type === "out"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <span className="ml-2 flex items-center">
                      <TrendingDown className="h-5 w-5 text-red-600 mr-1" />
                      Stock Out
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity *
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                Reference
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="reference"
                  id="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Order #, Invoice #, etc."
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Additional information about this stock movement"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/stock-movements")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Movement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
