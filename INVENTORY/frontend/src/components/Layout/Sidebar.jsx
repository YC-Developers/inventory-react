import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Home, Package, ShoppingBag, Tag, TrendingUp, Users, LogOut, X } from "lucide-react"

export default function Sidebar({ isOpen, isMobile, closeSidebar }) {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/products", name: "Products", icon: <Package className="w-5 h-5" /> },
    { path: "/categories", name: "Category", icon: <Tag className="w-5 h-5" /> },
    { path: "/inventory", name: "Inventory", icon: <ShoppingBag className="w-5 h-5" /> },
    { path: "/stock-movements", name: "Stock Movements", icon: <TrendingUp className="w-5 h-5" /> },
    { path: "/users", name: "Users", icon: <Users className="w-5 h-5" />, adminOnly: true }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
  }

  const sidebarClasses = `bg-green-900 text-white fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out transform ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } ${!isMobile ? "md:translate-x-0" : ""}`

  return (
    <>
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeSidebar}></div>
      )}

      <aside className={sidebarClasses}>
        <div className="h-full flex flex-col">
          <div className="px-4 py-6 flex justify-between items-center border-b border-green-800">
            <h1 className="text-xl font-bold">Inventory System</h1>
            {isMobile && (
              <button 
                onClick={closeSidebar} 
                className="text-white p-1 rounded hover:bg-green-800"
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                if (item.adminOnly && user?.role !== "admin") return null

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                      isActive(item.path) ? "bg-green-800 text-white font-medium" : "text-green-100 hover:bg-green-800"
                    }`}
                    onClick={isMobile ? closeSidebar : undefined}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    <span className="mr-3" aria-hidden="true">{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive(item.path) && <span className="ml-auto h-2 w-2 rounded-full bg-white" aria-hidden="true"></span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-green-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-green-100 rounded-md hover:bg-green-800 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 mr-3" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
