import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Award, Target, Filter, Download, Calendar, Eye } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { CustomDateFilter } from '../../components/common/CustomDateFilter';

export const MasterAnalytics: React.FC = () => {
  const { users, plans, drones, scenarios, incomeRecords } = useData();
  const [dateFilter, setDateFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string } | null>(null);

  const handleDateFilterChange = (value: string, customRange?: { start: string; end: string }) => {
    setDateFilter(value);
    if (customRange) {
      setCustomDateRange(customRange);
    } else {
      setCustomDateRange(null);
    }
  };

  // Calculate plan popularity
  const planAnalytics = plans.map(plan => {
    const planUsers = users.filter(u => u.plan === plan.name);
    const revenue = planUsers.reduce((sum, user) => sum + (user.paidAmount || 0), 0);
    const growthRate = Math.random() * 20 + 5; // Mock growth rate
    
    return {
      ...plan,
      userCount: planUsers.length,
      revenue,
      growthRate: growthRate.toFixed(1),
      conversionRate: ((planUsers.length / users.length) * 100).toFixed(1),
      avgRevenuePerUser: planUsers.length > 0 ? (revenue / planUsers.length).toFixed(0) : '0'
    };
  }).sort((a, b) => b.userCount - a.userCount);

  // Calculate drone popularity (from custom plans)
  const droneAnalytics = drones.map(drone => {
    const usageCount = users.filter(user => 
      user.customPlan?.selectedDrones.includes(drone.name)
    ).length;
    const revenue = usageCount * drone.price;
    
    return {
      ...drone,
      usageCount,
      revenue,
      popularityScore: (usageCount * 10 + revenue * 0.1).toFixed(0),
      marketShare: ((usageCount / users.length) * 100).toFixed(1)
    };
  }).sort((a, b) => b.usageCount - a.usageCount);

  // Calculate scenario popularity
  const scenarioAnalytics = scenarios.map(scenario => {
    const usageCount = users.filter(user => 
      user.customPlan?.selectedScenarios.includes(scenario.name)
    ).length;
    const revenue = usageCount * scenario.price;
    
    return {
      ...scenario,
      usageCount,
      revenue,
      popularityScore: (usageCount * 10 + revenue * 0.1).toFixed(0),
      completionRate: (Math.random() * 30 + 70).toFixed(1) // Mock completion rate
    };
  }).sort((a, b) => b.usageCount - a.usageCount);

  // Calculate totals
  const totalRevenue = incomeRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalCustomPlanUsers = users.filter(u => u.plan === 'Custom').length;
  const avgCustomPlanValue = totalCustomPlanUsers > 0 
    ? users.filter(u => u.plan === 'Custom').reduce((sum, u) => sum + (u.paidAmount || 0), 0) / totalCustomPlanUsers 
    : 0;

  const exportAnalytics = () => {
    const data = {
      plans: planAnalytics,
      drones: droneAnalytics,
      scenarios: scenarioAnalytics,
      summary: {
        totalRevenue,
        totalUsers: users.length,
        totalCustomPlanUsers,
        avgCustomPlanValue
      }
    };

    const csvContent = [
      ['Type', 'Name', 'Users/Usage', 'Revenue', 'Growth/Popularity', 'Additional Metric'],
      ...planAnalytics.map(p => ['Plan', p.name, p.userCount, `$${p.revenue}`, `${p.growthRate}%`, `${p.conversionRate}% conversion`]),
      ...droneAnalytics.map(d => ['Drone', d.name, d.usageCount, `$${d.revenue}`, d.popularityScore, `${d.marketShare}% market share`]),
      ...scenarioAnalytics.map(s => ['Scenario', s.name, s.usageCount, `$${s.revenue}`, s.popularityScore, `${s.completionRate}% completion`])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive analytics for plans, drones, and scenarios performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <CustomDateFilter
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="w-48"
          />
          <button
            onClick={exportAnalytics}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {customDateRange && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <Calendar className="w-4 h-4 inline mr-1" />
            Analyzing data from {new Date(customDateRange.start).toLocaleDateString()} to {new Date(customDateRange.end).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+18.5% growth</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{users.filter(u => u.status === 'Active').length}</p>
              <p className="text-sm text-blue-600 mt-1">Across all plans</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Custom Plans</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalCustomPlanUsers}</p>
              <p className="text-sm text-purple-600 mt-1">Avg: ${avgCustomPlanValue.toFixed(0)}/month</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Plan</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{planAnalytics[0]?.name}</p>
              <p className="text-sm text-yellow-600 mt-1">{planAnalytics[0]?.userCount} users</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Analytics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Plan Performance Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Detailed breakdown of subscription plan performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARPU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planAnalytics.map((plan, index) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">${plan.price}/month</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{plan.userCount}</div>
                    <div className="text-sm text-gray-500">users</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">${plan.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      +{plan.growthRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{plan.conversionRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${plan.avgRevenuePerUser}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${plan.conversionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{plan.conversionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drone & Scenario Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Drones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Most Popular Drones</h3>
            <p className="text-sm text-gray-500 mt-1">Usage in custom plans</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {droneAnalytics.slice(0, 8).map((drone, index) => (
                <div key={drone.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{drone.name}</p>
                      <p className="text-xs text-gray-500">{drone.type} • ${drone.price}/month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{drone.usageCount} users</p>
                    <p className="text-xs text-green-600">${drone.revenue} revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Scenarios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Most Popular Scenarios</h3>
            <p className="text-sm text-gray-500 mt-1">Usage and completion rates</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {scenarioAnalytics.slice(0, 8).map((scenario, index) => (
                <div key={scenario.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{scenario.name}</p>
                      <p className="text-xs text-gray-500">{scenario.category} • {scenario.difficulty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{scenario.usageCount} users</p>
                    <p className="text-xs text-blue-600">{scenario.completionRate}% completion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Distribution</h3>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>Total: ${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${planAnalytics.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Standard Plans Revenue</p>
            <p className="text-xs text-gray-500 mt-1">
              {((planAnalytics.reduce((sum, p) => sum + p.revenue, 0) / totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${droneAnalytics.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Drone Revenue</p>
            <p className="text-xs text-gray-500 mt-1">From custom plans</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ${scenarioAnalytics.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Scenario Revenue</p>
            <p className="text-xs text-gray-500 mt-1">From custom plans</p>
          </div>
        </div>
      </div>
    </div>
  );
};