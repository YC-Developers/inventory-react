import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

// Auth Components
import LoginPage from "./components/auth/LoginPage"
import PrivateRoute from "./components/auth/PrivateRoute"

// Dashboard Components
import DashboardPage from "./components/dashboard/DashboardPage"

// Product Components
import ProductsPage from "./components/products/ProductsPage"
import ProductForm from "./components/products/ProductForm"

// Category Components
import CategoriesPage from "./components/category/CategoriesPage"
import CategoryForm from "./components/category/CategoryForm"

// Inventory Components
import InventoryPage from "./components/inventory/InventoryPage"

// Stock Movement Components
import StockMovementsPage from "./components/stockMovements/StockMovementsPage"
import StockMovementForm from "./components/stockMovements/StockMovementForm"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />

            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/:id/edit" element={<CategoryForm />} />

            <Route path="/inventory" element={<InventoryPage />} />

            <Route path="/stock-movements" element={<StockMovementsPage />} />
            <Route path="/stock-movements/new" element={<StockMovementForm />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
