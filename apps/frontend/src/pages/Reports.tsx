import React, { useState } from 'react';
import { useRevenueReport, useMonthlyStats } from '../hooks/useReports';
import { RevenueChart } from '../components/reports/RevenueChart';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DollarSign, TrendingUp, BarChart3, Calendar } from 'lucide-react';

export const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const { data: revenueReport, isLoading: revenueLoading } = useRevenueReport(dateRange.from, dateRange.to);
  const { data: monthlyStats, isLoading: monthlyLoading } = useMonthlyStats();

  const isLoading = revenueLoading || monthlyLoading;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="text-sm border-none focus:ring-0 p-0"
            />
          </div>
          <span className="text-gray-400">to</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="text-sm border-none focus:ring-0 p-0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${Number(revenueReport?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          variant="blue"
        />
        <StatsCard
          title="Sales Count"
          value={revenueReport?.saleCount || 0}
          icon={TrendingUp}
          variant="green"
        />
        <StatsCard
          title="Average Sale Price"
          value={`$${Number(revenueReport?.averageSalePrice || 0).toLocaleString()}`}
          icon={BarChart3}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <RevenueChart data={monthlyStats || []} />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyStats?.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(stat.month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${Number(stat.revenue).toLocaleString()}
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