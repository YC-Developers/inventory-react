"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { categoryService } from "../../services/api"
import { Plus, Edit, Trash2 } from "lucide-react"
import DeleteConfirmation from "../../common/DeleteConfirmation"

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]) // Initialize as empty array
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const data = await categoryService.getAll()
                // Ensure data is an array before setting it
                setCategories(Array.isArray(data) ? data : [])
                setLoading(false)
            } catch (err) {
                console.error("Error fetching categories:", err)
                setError("Failed to load categories. Please try again.")
                setLoading(false)
                // Set categories to empty array on error
                setCategories([])
            }
        }

        fetchCategories()
    }, [])

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id)
            setCategories(categories.filter((category) => category._id !== id))
            setShowDeleteModal(false)
        } catch (err) {
            console.error("Error deleting category:", err)
            setError("Failed to delete category. This category may be in use by products.")
        }
    }

    const confirmDelete = (category) => {
        setCategoryToDelete(category)
        setShowDeleteModal(true)
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
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

                <Link
                    to="/categories/new"
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Add Category
                </Link>

            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Ensure categories is an array before checking length */}
                {Array.isArray(categories) && categories.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <p>No categories found. Create your first category to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Products
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
                                {/* Ensure categories is an array before mapping */}
                                {Array.isArray(categories) && categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-700">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{category.description || "No description"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.productCount || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link to={`/categories/${category._id}/edit`} className="text-green-600 hover:text-green-900">
                                                    <Edit className="h-5 w-5" />
                                                </Link>
                                                <button onClick={() => confirmDelete(category)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <DeleteConfirmation
                    isOpen={showDeleteModal}
                    title="Delete Category"
                    message={`Are you sure you want to delete ${categoryToDelete?.name}? This action cannot be undone.`}
                    onConfirm={() => handleDelete(categoryToDelete._id)}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    )
}