"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { inventoryService, categoryService } from "../../services/api"
import { Plus, Search, Filter, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        const data = await inventoryService.getAll()
        setInventory(Array.isArray(data) ? data : [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching inventory:", err)
        setError("Failed to load inventory. Please try again.")
        setInventory([]) // Ensure inventory is reset to an empty array on error
        setLoading(false)
      }
    }
    
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchInventory()
    fetchCategories()
  }, [])

  const filteredInventory = (inventory || []).filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  
    const matchesCategory = categoryFilter ? item.product.category?._id === categoryFilter : true
  
    const isLowStock = item.currentStock <= (item.product.minStockLevel || 5)
  
    if (stockFilter === "low" && !isLowStock) return false
    if (stockFilter === "out" && item.currentStock > 0) return false
    if (stockFilter === "in" && item.currentStock <= 0) return false
  
    return matchesSearch && matchesCategory
  })
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>

        <Link
          to="/stock-movements/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Stock Movement
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 md:flex-initial">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 md:flex-initial">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="all">All Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                  <option value="in">In Stock</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SKU
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Current Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Min Level
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLowStock = item.currentStock <= (item.product.minStockLevel || 5)
                  const isOutOfStock = item.currentStock <= 0

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/products/${item.product._id}`} className="hover:underline text-green-700">
                            {item.product.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`${isOutOfStock ? "text-red-600 font-medium" : isLowStock ? "text-amber-500 font-medium" : "text-gray-900"}`}
                        >
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.product.minStockLevel || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isOutOfStock ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                              Low Stock
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/stock-movements/new?product=${item.product._id}&type=in`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <TrendingUp className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/stock-movements/new?product=${item.product._id}&type=out`}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrendingDown className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
