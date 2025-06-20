import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Users, CreditCard, FileText, UserCog, TrendingUp, Download, Search, Bone as Drone, X, BarChart3, Package, PieChart } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  const masterAdminNavItems = [
    { path: '/Dash/master/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/Dash/master/users', label: 'Registered Users', icon: Users },
    { path: '/Dash/master/plans', label: 'Subscription Plans', icon: CreditCard },
    { path: '/Dash/master/products', label: 'Products', icon: Package },
    { path: '/Dash/master/annotations', label: 'Change Logs', icon: FileText },
    { path: '/Dash/master/employees', label: 'Employee Management', icon: UserCog },
    { path: '/Dash/master/income', label: 'Income Reports', icon: TrendingUp },
    { path: '/Dash/master/metrics', label: 'User Metrics', icon: BarChart3 },
    { path: '/Dash/master/analytics', label: 'Analytics', icon: PieChart },
  ];

  const adminNavItems = [
    { path: '/Dash/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/Dash/admin/users', label: 'Users Overview', icon: Users },
    { path: '/Dash/admin/plans', label: 'Plans & Access', icon: CreditCard },
    { path: '/Dash/admin/products', label: 'Products', icon: Package },
    { path: '/Dash/admin/downloads', label: 'Downloads Report', icon: Download },
    { path: '/Dash/admin/annotations', label: 'Plan Annotations', icon: FileText },
    { path: '/Dash/admin/search', label: 'User Search', icon: Search },
    { path: '/Dash/admin/metrics', label: 'User Metrics', icon: BarChart3 },
    { path: '/Dash/admin/analytics', label: 'Analytics', icon: PieChart },
  ];

  const navItems = user?.role === 'master' ? masterAdminNavItems : adminNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Drone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">DroneSim</h1>
                <p className="text-xs text-gray-500">
                  {user?.role === 'master' ? 'Master Admin' : 'Admin Panel'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-150
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || `https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2`}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};