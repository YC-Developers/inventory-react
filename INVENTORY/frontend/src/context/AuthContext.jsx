"use client"

import { createContext, useState, useEffect } from "react"
import { api, authService } from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        // Set token on axios instance
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Get user from localStorage
        const currentUser = authService.getCurrentUser()

        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }

        setLoading(false)
      } catch (err) {
        console.error("Auth check error:", err)
        authService.logout()
        api.defaults.headers.common["Authorization"] = null
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Update the login function to use username instead of email
  const login = async (username, password) => {
    try {
      const response = await authService.login({ username, password })

      api.defaults.headers.common["Authorization"] = `Bearer ${response.token}`

      setUser(response.user)
      setIsAuthenticated(true)

      return response.user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    api.defaults.headers.common["Authorization"] = null

    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
