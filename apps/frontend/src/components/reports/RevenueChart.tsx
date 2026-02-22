import React from 'react';
import { MonthlyStat } from '../../services/reports.service';

interface RevenueChartProps {
  data: MonthlyStat[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">No data available for the selected period</p>
      </div>
    );
  }

  // Sort data by month ascending for the chart
  const sortedData = [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  
  const maxRevenue = Math.max(...sortedData.map(d => d.revenue), 1);

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue Trend</h2>
      <div className="relative h-64 flex items-end justify-between gap-2 px-2">
        {sortedData.map((item, index) => {
          const height = (item.revenue / maxRevenue) * 100;
          const monthName = new Date(item.month).toLocaleDateString('default', { month: 'short' });
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              <div 
                className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-all duration-300"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  ${Number(item.revenue).toLocaleString()} ({item.sales} sales)
                </div>
              </div>
              <span className="text-[10px] text-gray-500 mt-2 rotate-45 origin-left whitespace-nowrap">
                {monthName}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-12 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary-500 rounded mr-1"></div>
          <span>Revenue</span>
        </div>
      </div>
    </div>
  );
};