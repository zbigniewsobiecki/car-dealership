import { useVehicleStats, useRecentVehicles } from '../hooks/useVehicles';
import { useSalesStats } from '../hooks/useSales';
import { useRepairStats, useActiveRepairs } from '../hooks/useRepairs';
import { Car, DollarSign, TrendingUp, Package, Wrench } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentVehiclesTable } from '../components/dashboard/RecentVehiclesTable';

export const Dashboard = () => {
  const { data: vehicleStats, isLoading: vehicleStatsLoading } = useVehicleStats();
  const { data: salesStats, isLoading: salesStatsLoading } = useSalesStats();
  const { data: repairStats, isLoading: repairStatsLoading } = useRepairStats();
  const { data: activeRepairs, isLoading: activeRepairsLoading } = useActiveRepairs(5);
  const { data: recentVehicles, isLoading: recentVehiclesLoading } = useRecentVehicles(5);

  const isLoading = vehicleStatsLoading || salesStatsLoading || repairStatsLoading || recentVehiclesLoading || activeRepairsLoading;

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
        <StatsCard
          title="Total Vehicles"
          value={vehicleStats?.total || 0}
          icon={Car}
          variant="blue"
        />
        <StatsCard
          title="Available"
          value={vehicleStats?.available || 0}
          icon={Package}
          variant="green"
        />
        <StatsCard
          title="Total Sales"
          value={salesStats?.completed_sales || 0}
          icon={TrendingUp}
          variant="purple"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${Number(salesStats?.total_revenue || 0).toLocaleString()}`}
          icon={DollarSign}
          variant="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Repairs Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Total Repairs</span>
              <span className="text-lg font-bold text-gray-900">
                {repairStats?.total || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
              <span className="text-sm font-medium text-yellow-700">Pending</span>
              <span className="text-lg font-bold text-yellow-900">
                {repairStats?.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <span className="text-sm font-medium text-blue-700">In Progress</span>
              <span className="text-lg font-bold text-blue-900">
                {repairStats?.in_progress || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-green-700">Completed</span>
              <span className="text-lg font-bold text-green-900">
                {repairStats?.completed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded border-t-2 border-primary-200">
              <span className="text-sm font-medium text-primary-700">
                Total Actual Cost
              </span>
              <span className="text-lg font-bold text-primary-900">
                ${Number(repairStats?.total_actual_cost || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {activeRepairs && activeRepairs.length > 0 && (
        <div className="mt-8 card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Repairs</h2>
          <div className="space-y-3">
            {activeRepairs.map((repair) => (
              <div
                key={repair.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {repair.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {repair.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {repair.estimatedCost && (
                    <p className="text-sm font-semibold text-gray-900">
                      ${repair.estimatedCost.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RecentVehiclesTable vehicles={recentVehicles} />

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