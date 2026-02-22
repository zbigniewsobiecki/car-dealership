import React from 'react';
import { MonthlySalesStats } from '@car-dealership/shared-types';

interface RevenueChartProps {
  data: MonthlySalesStats[];
  height?: number;
  showLabels?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  height = 300,
  showLabels = true 
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300"
        style={{ height }}
      >
        <p className="text-gray-500">No data available for the selected period</p>
      </div>
    );
  }

  // Sort data by month ascending for the chart
  const sortedData = [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  
  const maxRevenue = Math.max(...sortedData.map(d => d.revenue), 1);

  return (
    <div className="w-full">
      <div className="relative flex items-end justify-between gap-2 px-2" style={{ height }}>
        {/* Y-axis grid lines (simplified) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full border-t border-gray-100 h-0" />
          ))}
        </div>

        {sortedData.map((item, index) => {
          const barHeight = (item.revenue / maxRevenue) * 100;
          const monthLabel = new Date(item.month).toLocaleDateString('default', { month: 'short' });
          
          return (
            <div key={index} className="relative flex-1 flex flex-col items-center group">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  <p className="font-bold">{new Date(item.month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
                  <p>Revenue: ${Number(item.revenue).toLocaleString()}</p>
                  <p>Sales: {item.salesCount}</p>
                </div>
                <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1"></div>
              </div>

              {/* Bar */}
              <div 
                className="w-full max-w-[40px] bg-primary-500 hover:bg-primary-600 rounded-t transition-all duration-300 cursor-pointer"
                style={{ height: `${barHeight}%` }}
              ></div>
              
              {/* Label */}
              {showLabels && (
                <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">
                  {monthLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};