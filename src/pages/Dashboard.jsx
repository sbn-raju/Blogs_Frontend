// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Link for navigation and Outlet for nested routes
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import { MdRateReview, MdManageAccounts } from "react-icons/md";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { useAuth } from '../hooks/authHook';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to manage sidebar toggle
  const {logout} = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-auto">
      {/* Sidebar */}
      <div className={`w-${sidebarOpen ? '64' : '16'} bg-gray-800 text-white h-auto p-4 transition-all relative`}>
        {/* Toggle Button inside the sidebar */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="absolute top-4 left-4 p-2 rounded bg-gray-700 hover:bg-gray-600">
          {sidebarOpen ? '←' : '→'}
        </button>

        <nav className="flex flex-col gap-4 mt-16">
          <Link to="/home" className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded">
            <FaHome className="text-lg" />
            {sidebarOpen && <span>Home</span>}
          </Link>
          <Link to="/create" className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded">
            <IoMdCreate className="text-lg" />
            {sidebarOpen && <span>Create Blogs</span>}
          </Link>
          <Link to="/review" className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded">
            <MdRateReview className="text-lg" />
            {sidebarOpen && <span>View Blogs</span>}
          </Link>
          <Link to="/publish" className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded">
            <FiSunrise className="text-lg" />
            {sidebarOpen && <span>Publish Blogs</span>}
          </Link>
          <Link to="/review" className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded">
            <FiSunset className="text-lg" />
            {sidebarOpen && <span>Unpublish Blogs</span>}
          </Link>
          <Link to="/manage" className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded">
            <MdManageAccounts className="text-lg" />
            {sidebarOpen && <span>Manage Blogs</span>}
          </Link>
          <Link className="flex items-center gap-4 hover:bg-gray-700 p-2 rounded" onClick={()=>{
              logout();
              navigate("/login");
            }}>
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span>Logout</span>}
            
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8">
        {/* Outlet for sub-routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
