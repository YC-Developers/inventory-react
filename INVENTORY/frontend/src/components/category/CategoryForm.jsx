"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { categoryService } from "../../services/api"
import { Save, X } from "lucide-react"

export default function CategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode) {
        try {
          setLoading(true)
          const category = await categoryService.getById(id)
          
          // Check if category exists before setting form data
          if (category) {
            setFormData({
              name: category.name || "",
              description: category.description || "",
            })
          } else {
            setError("Category not found")
          }
          
          setLoading(false)
        } catch (err) {
          console.error("Error fetching category:", err)
          setError("Failed to load category data. Please try again.")
          setLoading(false)
        }
      }
    }

    fetchCategory()
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

      if (isEditMode) {
        await categoryService.update(id, formData)
      } else {
        await categoryService.create(formData)
      }

      navigate("/categories")
    } catch (err) {
      console.error("Error saving category:", err)
      setError("Failed to save category. Please try again.")
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
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Category" : "Add New Category"}</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate("/categories")}
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
            {loading ? "Saving..." : "Save Category"}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                  className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
