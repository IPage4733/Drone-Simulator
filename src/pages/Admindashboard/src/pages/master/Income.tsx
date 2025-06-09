import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, Download, Filter } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { CustomDateFilter } from '../../components/common/CustomDateFilter';

export const MasterIncome: React.FC = () => {
  const { incomeRecords, plans } = useData();
  const [monthFilter, setMonthFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null);

  const handleDateFilterChange = (value: string, customRange?: { start: string; end: string }) => {
    setMonthFilter(value);
    if (customRange) {
      setCustomDateRange(customRange);
    } else {
      setCustomDateRange(null);
    }
  };

  // Generate mock monthly data for the last 6 months
  const monthlyData = [
    { month: 'Aug 2023', revenue: 60600, growth: 11.8, subscriptions: 856, avgRevenue: 70.79 },
    { month: 'Sep 2023', revenue: 66100, growth: 9.1, subscriptions: 903, avgRevenue: 73.20 },
    { month: 'Oct 2023', revenue: 70500, growth: 6.7, subscriptions: 967, avgRevenue: 72.89 },
    { month: 'Nov 2023', revenue: 81200, growth: 15.2, subscriptions: 1024, avgRevenue: 79.30 },
    { month: 'Dec 2023', revenue: 87800, growth: 8.3, subscriptions: 1089, avgRevenue: 80.62 },
    { month: 'Jan 2024', revenue: 98750, growth: 12.5, subscriptions: 1150, avgRevenue: 85.87 }
  ];

  const filteredRecords = incomeRecords.filter(record => {
    const matchesPlan = planFilter === 'all' || record.plan === planFilter;
    const matchesPayment = paymentMethodFilter === 'all' || record.paymentMethod === paymentMethodFilter;
    
    let matchesMonth = true;
    if (monthFilter !== 'all') {
      const recordDate = new Date(record.date);
      const now = new Date();
      
      if (monthFilter === 'custom' && customDateRange) {
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        matchesMonth = recordDate >= startDate && recordDate <= endDate;
      } else {
        const monthsDiff = (now.getFullYear() - recordDate.getFullYear()) * 12 + (now.getMonth() - recordDate.getMonth());
        
        switch (monthFilter) {
          case 'today':
            const today = new Date();
            matchesMonth = recordDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesMonth = recordDate >= weekAgo;
            break;
          case 'month':
            matchesMonth = monthsDiff === 0;
            break;
          case 'quarter':
            matchesMonth = monthsDiff <= 3;
            break;
          case 'year':
            matchesMonth = monthsDiff <= 12;
            break;
          case 'last7':
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesMonth = recordDate >= last7Days;
            break;
          case 'last30':
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesMonth = recordDate >= last30Days;
            break;
          case 'last90':
            const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            matchesMonth = recordDate >= last90Days;
            break;
        }
      }
    }
    
    return matchesPlan && matchesPayment && matchesMonth;
  });

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const avgGrowth = monthlyData.reduce((sum, month) => sum + month.growth, 0) / monthlyData.length;
  const bestMonth = monthlyData.reduce((best, month) => 
    month.revenue > best.revenue ? month : best, monthlyData[0]
  );

  const exportToPDF = () => {
    // Mock PDF export functionality
    alert('PDF export functionality would be implemented here');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'User', 'Plan', 'Amount', 'Payment Method', 'Status'];
    const csvData = filteredRecords.map(record => [
      record.date,
      record.userName,
      record.plan,
      record.amount,
      record.paymentMethod,
      record.status
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Month-on-Month Income</h1>
          <p className="text-gray-500 mt-1">Track revenue trends and subscription growth</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                {customDateRange ? `${customDateRange.start} to ${customDateRange.end}` : 'Last 6 months'}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Growth</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{avgGrowth.toFixed(1)}%</p>
              <p className="text-sm text-blue-600 mt-1">Monthly average</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{bestMonth.month}</p>
              <p className="text-sm text-purple-600 mt-1">${bestMonth.revenue.toLocaleString()} revenue</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <CustomDateFilter
              value={monthFilter}
              onChange={handleDateFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Plans</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.name}>{plan.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="Stripe">Stripe</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setMonthFilter('all');
                setPlanFilter('all');
                setPaymentMethodFilter('all');
                setCustomDateRange(null);
              }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
        
        {customDateRange && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <Calendar className="w-4 h-4 inline mr-1" />
              Custom range: {new Date(customDateRange.start).toLocaleDateString()} - {new Date(customDateRange.end).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue Breakdown</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriptions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Revenue per User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((data, index) => (
                <tr key={data.month} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.month}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${data.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        +{data.growth}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{data.subscriptions}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${data.avgRevenue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <span className="text-sm text-gray-500">{filteredRecords.length} transactions</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {record.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${record.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};