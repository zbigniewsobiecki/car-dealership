import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { formatMonthYear } from '../../utils/dateUtils';

interface MonthlyStat {
  month: string;
  revenue: number;
  sales_count: number;
}

interface MonthlySalesChartProps {
  data: MonthlyStat[] | undefined;
}

export const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ data }) => {
  // Sort data by month ascending for the chart
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mb-4 opacity-20" />
        <p>No sales data available for the last 12 months</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...sortedData.map((d) => Number(d.revenue)), 1);
  const maxCount = Math.max(...sortedData.map((d) => Number(d.sales_count)), 1);

  return (
    <div className="card h-full">
      <div className="flex items-center space-x-2 mb-8">
        <BarChart3 className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Monthly Performance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Revenue</h3>
          <div className="flex items-end space-x-2 h-48">
            {sortedData.map((stat, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(Number(stat.revenue) / maxRevenue) * 100}%` }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${Number(stat.revenue).toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 rotate-45 origin-left whitespace-nowrap">
                  {formatMonthYear(stat.month)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Volume Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Sales Volume</h3>
          <div className="flex items-end space-x-2 h-48">
            {sortedData.map((stat, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600"
                  style={{ height: `${(Number(stat.sales_count) / maxCount) * 100}%` }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {stat.sales_count} sales
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 rotate-45 origin-left whitespace-nowrap">
                  {formatMonthYear(stat.month)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};