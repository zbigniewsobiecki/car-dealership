import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Vehicle } from '@car-dealership/shared-types';

interface RecentVehiclesTableProps {
  vehicles: Vehicle[] | undefined;
}

export const RecentVehiclesTable: React.FC<RecentVehiclesTableProps> = ({ vehicles }) => {
  return (
    <div className="mt-8 card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Recently Added Vehicles</h2>
        </div>
        <Link
          to="/vehicles"
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
                Vehicle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VIN
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {vehicle.vin}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ${vehicle.price.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      vehicle.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'sold'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vehicle.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!vehicles || vehicles.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};