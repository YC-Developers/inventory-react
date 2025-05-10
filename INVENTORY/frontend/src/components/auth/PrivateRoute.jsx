"use client"

import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import DashboardLayout from "../layout/DashboardLayout"

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
