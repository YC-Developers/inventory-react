"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { productService, categoryService } from "../../services/api"
import { Plus, Search, Filter, ArrowUp, ArrowDown, Trash2, Edit, Package } from "lucide-react"
import DeleteConfirmation from "../../common/DeleteConfirmation"
import ErrorBoundary from "../../components/ErrorBoundary";


export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState("name")
    const [sortDirection, setSortDirection] = useState("asc")
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [categoryFilter, setCategoryFilter] = useState("")
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const data = await productService.getAll()
                // Transform data to match expected structure if needed
                const transformedProducts = Array.isArray(data) ? data.map(product => ({
                    _id: product._id || product.productId,
                    name: product.name || "",
                    sku: product.sku || "",
                    description: product.description || "",
                    price: product.price || 0,
                    minStockLevel: product.minimumStock || 0,
                    imageUrl: product.imageUrl || "",
                    inventory: {
                        currentStock: product.inventory ? product.inventory.currentStock : 0
                    },
                    category: {
                        _id: product.category ? product.category._id : "",
                        name: product.category ? product.category.name : "Uncategorized"
                    }
                })) : [];

                setProducts(transformedProducts)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching products:", err)
                setError("Failed to load products. Please try again.")
                setLoading(false)
                setProducts([])
            }
        }


        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll()
                // Transform category data if needed
                const transformedCategories = Array.isArray(data) ? data.map(category => ({
                    _id: category.categoryId || category._id,
                    name: category.name || "Unnamed Category"
                })) : [];

                setCategories(transformedCategories)
            } catch (err) {
                console.error("Error fetching categories:", err)
                setCategories([])
            }
        }

        fetchProducts()
        fetchCategories()
    }, [])

    const handleDelete = async (id) => {
        try {
            // Use productId instead of _id if that's what the backend expects
            const idToDelete = typeof id === 'object' ? id.productId || id._id : id;
            await productService.delete(idToDelete)
            setProducts(products.filter((product) => (product._id || product.productId) !== idToDelete))
            setShowDeleteModal(false)
        } catch (err) {
            console.error("Error deleting product:", err)
            setError("Failed to delete product. Please try again.")
        }
    }

    const confirmDelete = (product) => {
        // Show an alert with inventory information before opening the delete modal
        const stockLevel = product.inventory?.currentStock || 0;
        const alertMessage = `You are about to delete ${product.name} (SKU: ${product.sku})\n\nCurrent Inventory: ${stockLevel} units`;

        if (window.confirm(alertMessage)) {
            setProductToDelete(product)
            setShowDeleteModal(true)
        }
    }

    const handleSort = (field) => {
        const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc"
        setSortField(field)
        setSortDirection(newDirection)
    }

    const sortedProducts = Array.isArray(products)
        ? [...products]
            .filter((product) => {
                const matchesSearch =
                    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.description || "").toLowerCase().includes(searchTerm.toLowerCase())

                const matchesCategory = categoryFilter ?
                    (product.category?._id || product.categoryId) === categoryFilter : true

                return matchesSearch && matchesCategory
            })
            .sort((a, b) => {
                if (sortField === "price") {
                    return sortDirection === "asc" ? a.price - b.price : b.price - a.price
                } else if (sortField === "currentStock") {
                    const aStock = a.inventory?.currentStock || 0
                    const bStock = b.inventory?.currentStock || 0
                    return sortDirection === "asc" ? aStock - bStock : bStock - aStock
                } else {
                    const aValue = (a[sortField] || "").toLowerCase()
                    const bValue = (b[sortField] || "").toLowerCase()
                    return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
                }
            })
        : []

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
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>

                <Link
                    to="/products/new"
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Product
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
                                    <option key="all-categories" value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category._id || category.categoryId} value={category._id || category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center">
                                        Product Name
                                        {sortField === "name" &&
                                            (sortDirection === "asc" ? (
                                                <ArrowUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ArrowDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("sku")}
                                >
                                    <div className="flex items-center">
                                        SKU
                                        {sortField === "sku" &&
                                            (sortDirection === "asc" ? (
                                                <ArrowUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ArrowDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("price")}
                                >
                                    <div className="flex items-center">
                                        Price
                                        {sortField === "price" &&
                                            (sortDirection === "asc" ? (
                                                <ArrowUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ArrowDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("currentStock")}
                                >
                                    <div className="flex items-center">
                                        Stock
                                        {sortField === "currentStock" &&
                                            (sortDirection === "asc" ? (
                                                <ArrowUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ArrowDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                sortedProducts.map((product) => (
                                    <tr key={product._id || product.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-500">
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="h-full w-full object-contain rounded-md"
                                                        />
                                                    ) : (
                                                        <Package className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <Link to={`/products/${product._id || product.productId}`} className="hover:underline text-green-700">
                                                            {product.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(product.price || 0).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className={`text-sm ${(product.inventory?.currentStock || 0) <= (product.minStockLevel || product.minimumStock || 5)
                                                    ? "text-red-600 font-medium"
                                                    : "text-gray-900"
                                                    }`}
                                            >
                                                {product.inventory?.currentStock || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {product.category?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link to={`/products/${product._id || product.productId}/edit`} className="text-green-600 hover:text-green-900">
                                                    <Edit className="h-5 w-5" />
                                                </Link>
                                                <button onClick={() => confirmDelete(product)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDeleteModal && (
                <ErrorBoundary>
                    <DeleteConfirmation
                        isOpen={showDeleteModal}
                        title="Delete Product"
                        message={`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`}
                        itemType="product"
                        onConfirm={() => handleDelete(productToDelete?._id || productToDelete?.productId)}
                        onCancel={() => setShowDeleteModal(false)}
                    />
                </ErrorBoundary>
            )}

        </div>
    )
}


