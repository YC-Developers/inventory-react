"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { stockMovementService } from "../../services/api"
import { Plus, Search, Filter, TrendingUp, TrendingDown } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

export default function StockMovementsPage() {
    const [movements, setMovements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                setLoading(true)
                const response = await stockMovementService.getAll({ page })
                
                // Initialize with empty array as fallback
                let movementsData = []
                let total = 0
                
                // Check response structure and extract data
                if (response) {
                    if (response.data && Array.isArray(response.data)) {
                        // Paginated response
                        movementsData = response.data
                        total = response.total || response.data.length
                    } else if (Array.isArray(response)) {
                        // Direct array response
                        movementsData = response
                        total = response.length
                    } else if (typeof response === 'object') {
                        // Some other object structure
                        console.log("Unexpected API response structure:", response)
                        movementsData = []
                        total = 0
                    }
                }
                
                setMovements(movementsData)
                setTotalPages(Math.ceil(total / limit) || 1) // Ensure at least 1 page
                setLoading(false)
            } catch (err) {
                console.error("Error fetching stock movements:", err)
                setError(`Failed to load stock movements: ${err.message || "Unknown error"}`)
                setLoading(false)
                setMovements([]) // Initialize with empty array
                setTotalPages(1)
            }
        }

        fetchMovements()
    }, [page]) // Only include page in the dependency array


    const filteredMovements = movements.filter((movement) => {
        const matchesSearch =
            movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movement.reference?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter ? movement.type === typeFilter : true

        return matchesSearch && matchesType
    })

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }

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
                <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>

                <Link
                    to="/stock-movements/new"
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Movement
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
                                placeholder="Search products or references..."
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
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="in">Stock In</option>
                                    <option value="out">Stock Out</option>
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
                                    Date
                                </th>
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
                                    Type
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Quantity
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Reference
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMovements.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No stock movements found
                                    </td>
                                </tr>
                            ) : (
                                filteredMovements.map((movement) => (
                                    <tr key={movement._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{format(new Date(movement.date), "MMM d, yyyy")}</div>
                                            <div className="text-sm text-gray-500">
                                                {formatDistanceToNow(new Date(movement.date), { addSuffix: true })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                <Link to={`/products/${movement.product._id}`} className="hover:underline text-green-700">
                                                    {movement.product.name}
                                                </Link>
                                            </div>
                                            <div className="text-sm text-gray-500">{movement.product.sku}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${movement.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {movement.type === "in" ? (
                                                    <>
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                        Stock In
                                                    </>
                                                ) : (
                                                    <>
                                                        <TrendingDown className="h-3 w-3 mr-1" />
                                                        Stock Out
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.reference || "—"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{movement.notes || "—"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                                <span className="font-medium">{Math.min(page * limit, movements.length)}</span> of{" "}
                                <span className="font-medium">{movements.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${page === i + 1
                                                ? "z-10 bg-green-50 border-green-500 text-green-600"
                                                : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
