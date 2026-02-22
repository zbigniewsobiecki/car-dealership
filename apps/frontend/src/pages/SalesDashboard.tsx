import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Filter,
  Printer
} from 'lucide-react';
import { useSalesStats, useMonthlySalesStats, useSales } from '../hooks/useSales';
import { useRevenueReport } from '../hooks/useReports';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '@car-dealership/shared-types';
import { StatsCard } from '../components/dashboard/StatsCard';
import { MonthlySalesChart } from '../components/dashboard/MonthlySalesChart';
import { RecentSalesTable } from '../components/dashboard/RecentSalesTable';
import { formatLocalDate } from '../utils/dateUtils';

export const SalesDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [dateRange, setDateRange] = useState({
    from: formatLocalDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)),
    to: formatLocalDate(new Date()),
  });

  const { data: salesStats, isLoading: statsLoading } = useSalesStats();
  const { data: monthlyStats, isLoading: monthlyLoading } = useMonthlySalesStats();
  const { data: recentSales, isLoading: recentLoading } = useSales({ limit: 5, sortBy: 'saleDate', sortOrder: 'desc' });
  const { data: revenueReport, isLoading: reportLoading, refetch: refetchReport } = useRevenueReport(
    isAdmin ? dateRange.from : undefined,
    isAdmin ? dateRange.to : undefined,
    { enabled: isAdmin }
  );

  const isLoading = statsLoading || monthlyLoading || recentLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sales analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your dealership's sales performance and revenue.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.print()}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${Number(salesStats?.total_revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          variant="amber"
        />
        <StatsCard
          title="Avg. Sale Price"
          value={`$${Number(salesStats?.average_sale_price || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          variant="blue"
        />
        <StatsCard
          title="Completed Sales"
          value={salesStats?.completed_sales || 0}
          icon={BarChart3}
          variant="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Performance Chart */}
        <div className="lg:col-span-2">
          <MonthlySalesChart data={monthlyStats} />
        </div>

        {/* Recent Sales Table */}
        <div className="lg:col-span-1">
          <RecentSalesTable sales={recentSales} />
        </div>
      </div>

      {/* Admin Revenue Report Section */}
      {isAdmin && (
        <div className="card border-primary-100 bg-primary-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Revenue Report</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <label htmlFor="from" className="text-sm font-medium text-gray-700">From:</label>
                <input
                  type="date"
                  id="from"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="input py-1 px-2 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="to" className="text-sm font-medium text-gray-700">To:</label>
                <input
                  type="date"
                  id="to"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="input py-1 px-2 text-sm"
                />
              </div>
              <button 
                onClick={() => refetchReport()}
                className="btn btn-primary py-1 px-3 text-sm flex items-center space-x-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {reportLoading ? (
            <div className="py-8 text-center text-gray-500">Loading report...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500 uppercase">Period Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${Number(revenueReport?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500 uppercase">Period Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {revenueReport?.saleCount || 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500 uppercase">Period Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${Number(revenueReport?.averageSalePrice || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};