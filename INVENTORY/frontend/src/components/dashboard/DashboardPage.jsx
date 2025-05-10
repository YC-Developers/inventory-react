"use client"

import { useState, useEffect } from "react"
import { dashboardService, productService, categoryService, stockMovementService } from "../../services/api"
import DashboardCard from "./DashboardCard"
import StockChart from "./StockChart"
import LowStockTable from "./LowStockTable"
import RecentMovementsTable from "./RecentMovementsTable"
import { Package, Tag, TrendingUp, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalMovements: 0,
    lowStockItems: 0,
  })
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [recentMovements, setRecentMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch dashboard summary
        const summary = await dashboardService.getSummary()

        // Fetch low stock items
        const lowStock = await dashboardService.getLowStock()

        // Fetch recent movements
        const movements = await dashboardService.getRecentMovements()

        // If the dashboard API isn't available, fetch data from individual endpoints
        if (!summary.totalProducts) {
          const [products, categories, stockMovements] = await Promise.all([
            productService.getAll(),
            categoryService.getAll(),
            stockMovementService.getAll(),
          ])

          setStats({
            totalProducts: products.length || 0,
            totalCategories: categories.length || 0,
            totalMovements: stockMovements.length || 0,
            lowStockItems: lowStock.length || 0,
          })
        } else {
          setStats(summary)
        }

        setLowStockProducts(lowStock)
        setRecentMovements(movements)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 hidden sm:block">Welcome to your inventory management dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="h-8 w-8 text-green-700" />}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <DashboardCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={<Tag className="h-8 w-8 text-green-700" />}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <DashboardCard
          title="Stock Movements"
          value={stats.totalMovements}
          icon={<TrendingUp className="h-8 w-8 text-green-700" />}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <DashboardCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<AlertTriangle className="h-8 w-8 text-amber-600" />}
          bgColor="bg-amber-50"
          textColor="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Stock Overview</h2>
          <StockChart />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Low Stock Items</h2>
          <LowStockTable products={lowStockProducts} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Recent Stock Movements</h2>
        <RecentMovementsTable movements={recentMovements} />
      </div>
    </div>
  )
}
