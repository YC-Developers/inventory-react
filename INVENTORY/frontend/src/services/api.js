import axios from "axios"

// Check if we're in development mode and use a fallback URL if needed
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
console.log("Using API URL:", API_URL)

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Check if the response is HTML instead of JSON
    const contentType = response.headers['content-type']
    if (contentType && contentType.includes('text/html')) {
      console.error("Received HTML response instead of JSON:", response.data)
      throw new Error("Received HTML response from server. API endpoint might be incorrect.")
    }
    return response.data
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials)
      if (response && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        return response
      } else {
        throw new Error("Invalid response format from server")
      }
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  },
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
  register: async (userData) => {
    return await api.post("/users/register", userData)
  },
  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },
}

// Product services
export const productService = {
  getAll: async () => {
    try {
      const response = await api.get("/products")
      console.log("Raw API response:", response)
      
      // If response is already processed by the interceptor
      if (Array.isArray(response)) {
        return response
      }
      
      // If response has a data property
      if (response && response.data) {
        return response.data
      }
      
      console.warn("Unexpected response format:", response)
      return []
    } catch (error) {
      console.error("Product API error:", error)
      throw error
    }
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  create: async (product) => {
    const response = await api.post("/products", product)
    return response.data
  },
  update: async (id, product) => {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },
  delete: async (id) => {
    try {
      return await api.delete(`/products/${id}`)
    } catch (error) {
      console.error(`Error in productService.delete(${id}):`, error)
      throw error
    }
  },
}

// Category services
export const categoryService = {
  getAll: async () => {
    try {
      return await api.get("/categories")
    } catch (error) {
      console.error('Error in categoryService.getAll:', error)
      throw error
    }
  },
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response
  },
  create: async (category) => {
    const response = await api.post("/categories", category)
    return response
  },
  update: async (id, category) => {
    const response = await api.put(`/categories/${id}`, category)
    return response
  },
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response
  },
}


// Inventory services
export const inventoryService = {
  getAll: async () => {
    const response = await api.get("/inventory")
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`)
    return response.data
  },
  getByProduct: async (productId) => {
    const response = await api.get(`/inventory/product/${productId}`)
    return response.data
  },
  update: async (id, inventory) => {
    const response = await api.put(`/inventory/${id}`, inventory)
    return response.data
  },
}

// Stock Movement services
export const stockMovementService = {
  getAll: async () => {
    const response = await api.get("/stock-movements")
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/stock-movements/${id}`)
    return response.data
  },
  create: async (movement) => {
    const response = await api.post("/stock-movements", movement)
    return response.data
  },
}

// Mock data for development (remove in production)
const mockLowStockItems = [
  { id: 1, name: "Product 1", currentStock: 5, minStockLevel: 10, category: "Electronics" },
  { id: 2, name: "Product 2", currentStock: 3, minStockLevel: 15, category: "Office Supplies" },
]

// Dashboard service with fallback to mock data
export const dashboardService = {
  getSummary: () =>
    api.get("/dashboard/summary").catch(() => ({
      totalProducts: 0,
      totalCategories: 0,
      lowStockItems: 0,
      recentMovements: 0,
    })),
  getLowStock: () => api.get("/dashboard/low-stock").catch(() => mockLowStockItems),
  getRecentMovements: () => api.get("/dashboard/recent-movements").catch(() => []),
}

export default api
