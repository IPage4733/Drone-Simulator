import React, { useState } from 'react';
import { Users as UsersIcon, Search, Filter, Eye, UserX, Calendar, Download } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/api/axios';
import { API_ENDPOINTS } from '@/config/api';
export const MasterUsers: React.FC = () => {
  const { plans, drones, scenarios, updateUserPlan, updateUserAddOns, updateCustomPlan } = useData();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');



  // Filters are now server-side, so we use the raw user data
  // No client-side filtering needed - backend handles everything
  const filteredUsers = users;





  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-gray-100 text-gray-800';
      case 'Zone': return 'bg-purple-100 text-purple-800';
      case 'Pro': return 'bg-blue-100 text-blue-800';
      case 'Enterprise': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const handleDeleteUser = async (email: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete user: ${email}?`);
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete('/delete-user/', {
        data: { email }
      });


      if (response.data.status === 'success') {
        alert('User deleted successfully');
        setUsers(prev => prev.filter(user => user.email !== email));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting user');
    }
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  // Add this inside your user processing logic (e.g., in fetch function or before render)
  const getTotalDuration = (scenarios: any[]) => {
    let totalSeconds = 0;

    scenarios.forEach(({ duration_formatted }) => {
      if (typeof duration_formatted === 'string') {
        const parts = duration_formatted.split(':').map(Number);
        if (parts.length === 3) {
          const [hrs, mins, secs] = parts;
          totalSeconds += (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
        }
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPaymentStatus = (user: any) => {
    if (!user.plan || user.plan === 'Free') return { status: 'Free Plan', color: 'text-gray-500' };

    if (!user.nextPaymentDate) return { status: 'No Payment Due', color: 'text-gray-500' };

    const nextPayment = new Date(user.nextPaymentDate);
    const today = new Date();
    const daysUntilPayment = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilPayment < 0) {
      return { status: 'Overdue', color: 'text-red-600' };
    } else if (daysUntilPayment <= 7) {
      return { status: `Due in ${daysUntilPayment} days`, color: 'text-yellow-600' };
    } else {
      return { status: `Due in ${daysUntilPayment} days`, color: 'text-green-600' };
    }
  };
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token =
          sessionStorage.getItem('drone_auth_token') ||
          localStorage.getItem('drone_auth_token');

        // Build query parameters with filters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          page_size: pageSize.toString(),
        });

        // Search parameter
        if (debouncedSearchTerm) {
          params.append('search', debouncedSearchTerm);
        }

        // Server-side filters (backend now supports these!)
        if (statusFilter !== 'all') {
          params.append('status', statusFilter.toLowerCase());
        }
        if (planFilter !== 'all') {
          // Send plan filter directly - backend now handles zone plans correctly
          params.append('plan', planFilter.toLowerCase());
        }
        if (startDate) {
          params.append('start_date', startDate);
        }
        if (endDate) {
          params.append('end_date', endDate);
        }

        // Single optimized API call (backend should include transaction data)
        const usersRes = await axiosInstance.get(`/get-all-users/?${params.toString()}`);

        const userList = usersRes.data.data;
        const pagination = usersRes.data.pagination;
        const stats = usersRes.data.statistics;

        // Update pagination state
        setTotalPages(pagination.total_pages);
        setTotalCount(pagination.total_count);
        setHasNext(pagination.has_next);
        setHasPrevious(pagination.has_previous);
        setStatistics(stats);
        // Transform user data (transaction data should come from backend)
        const formattedUsers = userList.map((user: any) => {
          // Backend should provide transaction data in user.transaction
          const txn = user.transaction || user.latest_transaction;

          // Get actual plan type from license_info (preferred) or fallback to user.plan
          const actualPlanType = user.license_info?.plan_type || user.plan;

          return {
            id: user.user_id,
            name: user.full_name || user.username || 'N/A',
            email: user.email,
            status: user.is_active ? 'Active' : 'Inactive',
            plan: user.plan || user?.transaction?.plan_display_name || null,
            paidAmount: txn ? parseFloat(txn.amount || 0) : 0,
            paymentDate: txn?.payment_date || null,
            nextPaymentDate: txn?.plan_expiry_date || user.license_info?.expires_at || user.plan_expiry_date || null,
            addOns: {},
            customPlan: null,
            usage: {
              simulationsThisMonth: user.statistics?.total_scenarios_completed || 0,
              totalSimulations: user.statistics?.total_app_sessions || 0,
              totalDuration: user.statistics?.total_duration_formatted || '00:00:00',
            },
            registrationDate: new Date(user.created_at).toLocaleDateString(),
            phone_number: user.phone_number || '',
            city: user.city || '',
            state_province: user.state_province || '',
            country: user.country || '',
            purpose_of_use: user.purpose_of_use || '',
          };
        });

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users or transactions:', error);
        setUsers([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter, planFilter, startDate, endDate]);

  // Note: Client-side filtering removed - now handled by backend
  // All filters (status, plan, dates) work server-side across entire dataset

  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  //this is the 
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading users...</div>;
  }
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Status',
      'Plan',
      'Paid Amount',
      'Payment Date',
      'Next Payment Date',
      'Simulations This Month',
      'Total Simulations',
      'Registration Date'
    ];

    const rows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.status,
      user.plan,
      user.paidAmount,
      user.paymentDate || '',
      user.nextPaymentDate || '',
      user.usage.simulationsThisMonth,
      user.usage.totalSimulations,
      user.registrationDate
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalDurationSeconds = (scenarios: any[]) => {
    let totalSeconds = 0;
    scenarios.forEach(({ duration_formatted }) => {
      if (typeof duration_formatted === 'string') {
        const [h = 0, m = 0, s = 0] = duration_formatted.split(':').map(Number);
        totalSeconds += h * 3600 + m * 60 + s;
      }
    });
    return totalSeconds;
  };
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aVal: any;
    let bVal: any;

    switch (sortConfig.key) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'registrationDate':
        aVal = new Date(a.registrationDate).getTime();
        bVal = new Date(b.registrationDate).getTime();
        break;
      case 'usageDuration':
        aVal = getTotalDurationSeconds(a.scenarios);
        bVal = getTotalDurationSeconds(b.scenarios);
        break;
      default:
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
          <p className="text-gray-500 mt-1">Manage all platform users and their subscriptions</p>
        </div>
        <div className="text-sm text-gray-600">
          {statistics ? (
            <>
              Total: {statistics.total_users} users • Active: {statistics.active_users}
              {debouncedSearchTerm && ` • Search results: ${totalCount}`}
            </>
          ) : (
            <>
              Total: {totalCount} users • Active: {users.filter(u => u.status === 'Active').length}
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, phone, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1); // Reset to page 1 when filter changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1); // Reset to page 1 when filter changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Plan Filter and Export Button */}
        <div className="flex justify-between items-center mt-4">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="zone">Zone</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

      </div>

      {/* Users Table */}
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-sm">
              <tr>
                {[
                  { key: 'name', label: 'User' },
                  { key: '', label: 'Plan & Configuration' },
                  { key: '', label: 'Status' },
                  { key: '', label: 'Payment' },
                  { key: 'usageDuration', label: 'Usage' },
                  { key: 'registrationDate', label: 'Joined' },
                  { key: '', label: 'Actions' },
                ].map(({ key, label }) => (
                  <th
                    key={label}
                    onClick={() => key && handleSort(key)}
                    className={`px-2 py-2 text-left font-medium text-gray-600 uppercase tracking-wide whitespace-nowrap text-[11px] ${key ? 'cursor-pointer select-none' : ''}`}
                  >
                    {label === 'Plan & Configuration' ? (
                      <>
                        PLAN
                        <br />
                        & CONFIGURATION
                      </>
                    ) : (
                      label
                    )}
                    {sortConfig.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                ))}

              </tr>
            </thead>


            <tbody className="bg-white divide-y divide-gray-100 text-[11px]">
              {sortedUsers.map((user) => {
                const paymentStatus = getPaymentStatus(user);
                return (
                  <tr
                    key={user.id}
                    onClick={() => window.location.href = `/dash/master/users/${user.email}`}
                    className="hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {/* User */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="leading-tight">
                          <div className="font-medium text-gray-900 text-[11px]">{user.name}</div>
                          <div className="text-gray-500 text-[10px] break-all">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`px-2 py-[2px] rounded-full text-[10px] font-medium ${getPlanColor(user.plan)}`}>
                        {user.plan || '-'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`px-2 py-[2px] rounded-full text-[10px] font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="px-2 py-2 whitespace-nowrap leading-tight">
                      <div className="text-green-600 font-semibold text-[11px]">
                        {user.plan === 'Free' ? 'Free Plan' : (user.paidAmount ? `₹${user.paidAmount}` : '-')}
                      </div>
                      <div className="text-gray-400 text-[10px]">
                        {user.plan && user.plan !== 'Free' && user.nextPaymentDate && paymentStatus.status}
                      </div>
                    </td>

                    {/* Usage */}
                    <td className="px-2 py-2 text-gray-600 whitespace-nowrap leading-tight">
                      <div className="text-[10px] text-gray-900">Count : {user.usage.simulationsThisMonth}</div>
                      {/* <div className="text-[10px] text-gray-400">{user.usage.totalSimulations} total</div> */}
                      <div className="text-[10px] text-gray-900">{user.usage.totalDuration}</div>
                    </td>

                    {/* Joined */}
                    <td className="px-2 py-2 whitespace-nowrap text-[10px]">{user.registrationDate}</td>

                    {/* Actions */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/dash/master/users/${user.email}`;
                          }}
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.email);
                          }}
                          title="Delete"
                        >
                          <UserX className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>


          </table>
        </div>
      </div>


      {/* Pagination Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
            </div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!hasPrevious || loading}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
                </>
              )}

              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  {currentPage - 1}
                </button>
              )}

              <button
                className="px-3 py-2 border border-blue-500 bg-blue-50 text-blue-600 rounded text-sm font-medium"
                disabled
              >
                {currentPage}
              </button>

              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={!hasNext || loading}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>



    </div>
  );
};