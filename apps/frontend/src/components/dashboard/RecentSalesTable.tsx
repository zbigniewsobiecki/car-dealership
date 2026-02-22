import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Sale } from '@car-dealership/shared-types';

interface RecentSalesTableProps {
  sales: Sale[] | undefined;
}

export const RecentSalesTable: React.FC<RecentSalesTableProps> = ({ sales }) => {
  return (
    <div className="mt-8 card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
        </div>
        <Link
          to="/sales"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales?.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {sale.vehicleId.substring(0, 8)}...
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ${sale.salePrice.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : sale.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!sales || sales.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No recent sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};