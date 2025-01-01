import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaHome, FaTachometerAlt, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`${
                    isOpen ? "w-64" : "w-16"
                } bg-gray-800 text-white h-full transition-all duration-300 flex flex-col overflow-hidden sm:w-64`}
            >
                {/* Toggle Button */}
                <button
                    className="text-white p-4 focus:outline-none"
                    onClick={toggleSidebar}
                >
                    {isOpen ? "<<" : ">>"}
                </button>

                {/* Navigation Links */}
                <nav className="flex-1 flex flex-col gap-4 p-4">
                    <Link
                        to="/"
                        className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded"
                    >
                        <FaHome className="text-lg" />
                        {isOpen && <span>Home</span>}
                    </Link>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded"
                    >
                        <FaTachometerAlt className="text-lg" />
                        {isOpen && <span>Dashboard</span>}
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded"
                    >
                        <FaCog className="text-lg" />
                        {isOpen && <span>Settings</span>}
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded"
                    >
                        <FaUser className="text-lg" />
                        {isOpen && <span>Profile</span>}
                    </Link>
                </nav>

                {/* Logout Link */}
                <div className="p-4">
                    <Link
                        to="/logout"
                        className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded"
                    >
                        <FaSignOutAlt className="text-lg" />
                        {isOpen && <span>Logout</span>}
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-8">
                <h1 className="text-2xl font-bold">Main Content</h1>
                <p className="mt-4">
                    This is the main content area. Click the button in the sidebar to toggle its size.
                </p>
            </div>
        </div>
    );
}

export default SideBar;
