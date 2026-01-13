import { useVehicleStats } from '../hooks/useVehicles';
import { useSalesStats } from '../hooks/useSales';
import { Car, DollarSign, TrendingUp, Package } from 'lucide-react';

export const Dashboard = () => {
  const { data: vehicleStats, isLoading: vehicleStatsLoading } = useVehicleStats();
  const { data: salesStats, isLoading: salesStatsLoading } = useSalesStats();

  const isLoading = vehicleStatsLoading || salesStatsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Vehicles</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {vehicleStats?.total || 0}
              </p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <Car className="h-8 w-8 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {vehicleStats?.available || 0}
              </p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <Package className="h-8 w-8 text-green-700" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Sales</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {salesStats?.completed_sales || 0}
              </p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Total Revenue</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                ${Number(salesStats?.total_revenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-amber-200 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-amber-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Total Inventory</span>
              <span className="text-lg font-bold text-gray-900">
                {vehicleStats?.total || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-700">Available</span>
              <span className="text-lg font-bold text-green-900">
                {vehicleStats?.available || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Sold</span>
              <span className="text-lg font-bold text-gray-900">
                {vehicleStats?.sold || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <span className="text-sm font-medium text-yellow-700">Reserved</span>
              <span className="text-lg font-bold text-yellow-900">
                {vehicleStats?.reserved || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <span className="text-sm font-medium text-red-700">Maintenance</span>
              <span className="text-lg font-bold text-red-900">
                {vehicleStats?.maintenance || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded border-t-2 border-primary-200">
              <span className="text-sm font-medium text-primary-700">
                Total Inventory Value
              </span>
              <span className="text-lg font-bold text-primary-900">
                ${Number(vehicleStats?.total_inventory_value || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Total Sales</span>
              <span className="text-lg font-bold text-gray-900">
                {salesStats?.total_sales || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-700">Completed</span>
              <span className="text-lg font-bold text-green-900">
                {salesStats?.completed_sales || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <span className="text-sm font-medium text-yellow-700">Pending</span>
              <span className="text-lg font-bold text-yellow-900">
                {salesStats?.pending_sales || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded border-t-2 border-primary-200">
              <span className="text-sm font-medium text-primary-700">Total Revenue</span>
              <span className="text-lg font-bold text-primary-900">
                ${Number(salesStats?.total_revenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded">
              <span className="text-sm font-medium text-primary-700">
                Average Sale Price
              </span>
              <span className="text-lg font-bold text-primary-900">
                ${Number(salesStats?.average_sale_price || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 p-4 rounded-full">
            <TrendingUp className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Welcome to Car Dealership Management</h3>
            <p className="text-gray-600 mt-1">
              Manage your inventory, track customers, and close deals all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
