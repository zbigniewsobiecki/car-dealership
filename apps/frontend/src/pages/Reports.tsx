import React, { useState } from 'react';
import { useRevenueReport, useMonthlyStats } from '../hooks/useReports';
import { RevenueChart } from '../components/reports/RevenueChart';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DollarSign, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';

export const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  const { data: revenueData, isLoading: revenueLoading } = useRevenueReport(dateRange.from, dateRange.to);
  const { data: monthlyStats, isLoading: monthlyLoading } = useMonthlyStats();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const isLoading = revenueLoading || monthlyLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="text-sm border-none focus:ring-0 p-1"
            />
          </div>
          <span className="text-gray-400">to</span>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="text-sm border-none focus:ring-0 p-1"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading report data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Revenue"
              value={`$${Number(revenueData?.totalRevenue || 0).toLocaleString()}`}
              icon={DollarSign}
              variant="blue"
            />
            <StatsCard
              title="Average Sale Price"
              value={`$${Number(revenueData?.averageSalePrice || 0).toLocaleString()}`}
              icon={TrendingUp}
              variant="purple"
            />
            <StatsCard
              title="Total Sales"
              value={revenueData?.saleCount || 0}
              icon={ShoppingBag}
              variant="green"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Revenue Trend (Last 12 Months)</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                </div>
              </div>
              <RevenueChart data={monthlyStats || []} />
            </div>
          </div>

          <div className="card overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Performance Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. per Sale</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyStats?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(item.month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.salesCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${Number(item.revenue).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.salesCount > 0 ? Number(item.revenue / item.salesCount).toLocaleString() : 0}
                      </td>
                    </tr>
                  ))}
                  {(!monthlyStats || monthlyStats.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};