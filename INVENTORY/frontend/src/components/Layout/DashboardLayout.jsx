"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - position fixed on mobile, static on desktop */}
      <div className={`${isMobile ? 'fixed z-20' : 'relative'} transition-all duration-300 ease-in-out`}>
        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area - should adjust based on sidebar state */}
      <div 
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        }`}
      >
        <Topbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 md:p-4">
          <div className="mx-auto max-w-7xl h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
