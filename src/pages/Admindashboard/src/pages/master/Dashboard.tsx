import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, CreditCard, Activity } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { CustomDateFilter } from '../../components/common/CustomDateFilter';
import { API_ENDPOINTS } from '@/config/api';

interface User {
  plan: string;
  is_active: boolean;
}

export const MasterDashboard: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('month');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null);
  const [planFilter, setPlanFilter] = useState('all');

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [inactiveUsers, setInactiveUsers] = useState<number>(0);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const { annotations } = useData();

  useEffect(() => {
    // Set loading state when filter changes
    setLoading(true);

    const fetchUserStats = async () => {
      try {
        // Build query parameters for time period filtering
        const params = new URLSearchParams();

        if (dateFilter && dateFilter !== 'all') {
          const now = new Date();
          let startDate = '';
          let endDate = '';

          if (dateFilter === 'today') {
            startDate = now.toISOString().split('T')[0];
            endDate = startDate;
          } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            startDate = weekAgo.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            startDate = monthAgo.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'quarter') {
            const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            startDate = quarterAgo.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'year') {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            startDate = yearAgo.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'last7') {
            const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            startDate = last7.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'last30') {
            const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            startDate = last30.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'last90') {
            const last90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            startDate = last90.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
          } else if (dateFilter === 'custom' && customDateRange) {
            startDate = customDateRange.start;
            endDate = customDateRange.end;
          }

          if (startDate) params.append('start_date', startDate);
          if (endDate) params.append('end_date', endDate);
        }

        const url = `${API_ENDPOINTS.GET_ALL_USERS}?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        const total = data?.statistics?.total_users || 0;
        const active = data?.statistics?.active_users || 0;
        setTotalUsers(total);
        setActiveUsers(active);
        setInactiveUsers(total - active);
        setUsersData(data?.data || []);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setTotalUsers(0);
        setActiveUsers(0);
        setInactiveUsers(0);
        setUsersData([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchRevenue = async () => {
      try {
        const token = sessionStorage.getItem('drone_auth_token');
        const res = await fetch(API_ENDPOINTS.STRIPE_ANALYTICS, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        const data = await res.json();
        setTotalRevenue(data?.total_revenue || 0);
      } catch (error) {
        console.error('Error fetching revenue:', error);
        setTotalRevenue(0);
      }
    };

    fetchUserStats();
    fetchRevenue();
  }, [dateFilter, customDateRange]); // Re-fetch when time period changes

  const stats = [
    {
      title: 'Inactive Users',
      value: loading ? '...' : inactiveUsers.toString(),
      changeType: 'neutral' as const,
      icon: Users,
      subtitle: 'Not currently active'
    },
    {
      title: 'Total Users',
      value: loading ? '...' : totalUsers.toString(),
      changeType: 'positive' as const,
      icon: Users,
      subtitle: loading ? 'Loading...' : `${activeUsers} active, ${inactiveUsers} inactive`
    },
    {
      title: 'Active Users',
      value: loading ? '...' : activeUsers.toString(),
      changeType: 'positive' as const,
      icon: Activity,
      subtitle: 'Currently engaged'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      changeType: 'positive' as const,
      icon: TrendingUp,
      subtitle: 'Overall earnings'
    }
  ];

  const handleDateFilterChange = (value: string, customRange?: { start: string; end: string }) => {
    setDateFilter(value);
    if (customRange) {
      setCustomDateRange(customRange);
    } else {
      setCustomDateRange(null);
    }
  };

  const planDistribution = [
    { label: 'Free Basic Plan', color: 'gray', match: (u: User) => u.plan?.toLowerCase() === 'free' },
    { label: 'Zone Plan', color: 'green', match: (u: User) => u.plan?.toLowerCase() === 'zone' },
    { label: 'Pro Plan', color: 'blue', match: (u: User) => u.plan?.toLowerCase() === 'pro' },
    { label: 'Enterprise Plan', color: 'purple', match: (u: User) => u.plan?.toLowerCase() === 'enterprise' }
  ].map(item => ({
    ...item,
    count: usersData.filter(item.match).length
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of platform performance and key metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <CustomDateFilter
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="mt-1">
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="space-y-4">
            {planDistribution.map(plan => (
              <div key={plan.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${plan.color}-500`}></div>
                  <span className="text-sm font-medium text-gray-900">{plan.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{plan.count}</span>
                  <span className="text-xs text-gray-500 ml-1">users</span>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-gray-900">
                {planDistribution.reduce((acc, plan) => acc + plan.count, 0)}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
