import React, { useState } from 'react';
import { TrendingUp, Users, CreditCard, Activity, Calendar, Filter } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { CustomDateFilter } from '../../components/common/CustomDateFilter';

export const MasterDashboard: React.FC = () => {
  const { users, plans, annotations, incomeRecords } = useData();
  const [dateFilter, setDateFilter] = useState('month');
  const [planFilter, setPlanFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null);

  const handleDateFilterChange = (value: string, customRange?: { start: string; end: string }) => {
    setDateFilter(value);
    if (customRange) {
      setCustomDateRange(customRange);
    } else {
      setCustomDateRange(null);
    }
  };

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const totalSubscriptions = users.filter(u => u.status === 'Active').length;
  const monthlyIncome = incomeRecords
    .filter(r => r.status === 'Completed')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalAnnotations = annotations.length;

  // Plan distribution
  const planDistribution = plans.map(plan => ({
    name: plan.name,
    count: users.filter(u => u.plan === plan.name).length,
    color: plan.color
  }));

  // Mock monthly income data for chart
  const monthlyIncomeData = [
    { month: 'Jul', income: 8750 },
    { month: 'Aug', income: 9200 },
    { month: 'Sep', income: 10100 },
    { month: 'Oct', income: 11500 },
    { month: 'Nov', income: 12800 },
    { month: 'Dec', income: 14200 }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      subtitle: `${activeUsers} active`
    },
    {
      title: 'Active Subscriptions',
      value: totalSubscriptions.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: CreditCard,
      subtitle: 'Paying customers'
    },
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      subtitle: customDateRange ? `${customDateRange.start} to ${customDateRange.end}` : 'This month'
    },
    {
      title: 'Total Edits',
      value: totalAnnotations.toString(),
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: Activity,
      subtitle: 'All time'
    }
  ];

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
          
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Plans</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.name}>{plan.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Income Trend</h3>
            <button className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {customDateRange ? `${customDateRange.start} to ${customDateRange.end}` : 'Last 6 months'}
              </span>
            </button>
          </div>
          
          <div className="h-64">
            <div className="flex items-end justify-between h-48 space-x-2">
              {monthlyIncomeData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                    style={{ height: `${(data.income / 15000) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$0</span>
              <span>$15K</span>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          
          <div className="space-y-4">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    plan.color === 'gray' ? 'bg-gray-500' :
                    plan.color === 'blue' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{plan.name}</span>
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
              <span className="text-gray-600">Total Active Users</span>
              <span className="font-semibold text-gray-900">{activeUsers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {annotations.slice(0, 5).map((annotation) => (
            <div key={annotation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{annotation.changeSummary}</p>
                <p className="text-xs text-gray-500">
                  {annotation.userName} • {annotation.adminName} • {new Date(annotation.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};