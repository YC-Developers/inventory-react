"use client"

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Menu, Bell, User, Search, ChevronDown } from "lucide-react"

export default function Topbar({ toggleSidebar }) {
    const { user } = useContext(AuthContext)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000) // Update every minute

        return () => clearInterval(timer)
    }, [])

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 md:hidden focus:outline-none">
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="hidden md:flex md:items-center ml-4 text-sm text-gray-500">{formatDate(currentTime)}</div>

                        <div className="relative ml-4 md:ml-6">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                className="form-input block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button className="p-2 ml-4 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none relative">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>

                        <div className="ml-3 relative">
                            <div>
                                <button
                                    className="flex items-center max-w-xs rounded-full focus:outline-none"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                                            {user?.username || "User"}
                                        </span>
                                        <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                                    </div>
                                </button>
                            </div>

                            {isProfileOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        <div className="font-medium">{user?.username || "User"}</div>
                                        <div className="text-gray-500 truncate">{user?.email || "user@example.com"}</div>
                                    </div>
                                    <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Your Profile
                                    </a>
                                    <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Settings
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};