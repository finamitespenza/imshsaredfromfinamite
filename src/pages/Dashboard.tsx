import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  getDashboardData,
  // ...add other needed functions here
} from '../utils/api';
import { DashboardCard } from '../components/DashboardCard';
import { StockTable } from '../components/StockTable';
import { Calendar, Package, RefreshCw, Truck, Warehouse, DollarSign } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  const [startDate, setStartDate] = useState(
    format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dashboardData, setDashboardData] = useState<any>({
    totalSKUs: 0,
    totalTransactions: 0,
    totalVendors: 0,
    totalWarehouses: 0,
    inventoryValuation: '0.00',
    lowStock: [],
    overStock: [],
    transactionsByType: {},
    inventoryByWarehouse: {},
    inventoryGrowth: [],
    stockMovements: [],
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboardData(startDate, endDate);
      setDashboardData(response);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    setLoading(false);
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await getRecentActivities();
      if (response && Array.isArray(response.recentTransactions)) {
        const allActivities = [
          ...(response.recentTransactions || []),
          ...(response.recentAddSKUs || []),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivities(allActivities);
      }
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
    }
  };

  const updateDashboard = () => {
    fetchDashboardData();
  };

  const resetFilters = () => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);
    
    setStartDate(format(last30Days, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
    
    setTimeout(() => {
      fetchDashboardData();
    }, 100);
  };

  // Prepare chart data
  const transactionsByTypeData = {
    labels: Object.keys(dashboardData.transactionsByType || {}),
    datasets: [
      {
        label: 'Transactions by Type',
        data: Object.values(dashboardData.transactionsByType || {}),
        backgroundColor: ['#4f46e5', '#34d399', '#ec4899', '#fbbf24'],
      },
    ],
  };

  const inventoryByWarehouseData = {
    labels: Object.keys(dashboardData.inventoryByWarehouse || {}),
    datasets: [
      {
        label: 'Inventory by Warehouse',
        data: Object.values(dashboardData.inventoryByWarehouse || {}),
        backgroundColor: ['#4f46e5', '#34d399', '#ec4899', '#fbbf24'],
      },
    ],
  };

  const growthChartData = {
    labels: (dashboardData.inventoryGrowth || []).map((item: any) => item.month),
    datasets: [
      {
        label: 'Inventory Growth',
        data: (dashboardData.inventoryGrowth || []).map((item: any) => item.value),
        borderColor: '#32a852',
        backgroundColor: 'rgba(50, 168, 78, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#32a852',
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="dashboard-header mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <RefreshCw className="mr-2 h-6 w-6 text-indigo-600" /> Inventory Dashboard
          </h1>
          <div className="date-controls flex flex-wrap items-center gap-3">
            <div className="input-group flex items-center">
              <span className="input-label flex items-center text-gray-700 mr-2">
                <Calendar className="h-4 w-4 mr-1" /> From:
              </span>
              <input
                type="date"
                id="startDate"
                className="date-input border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group flex items-center">
              <span className="input-label flex items-center text-gray-700 mr-2">
                <Calendar className="h-4 w-4 mr-1" /> To:
              </span>
              <input
                type="date"
                id="endDate"
                className="date-input border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors duration-200"
              onClick={updateDashboard}
            >
              <RefreshCw className="h-4 w-4 mr-1 inline" /> Update
            </button>
            <button
              className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm transition-colors duration-200"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <DashboardCard
              title="Total SKUs"
              value={dashboardData.totalSKUs}
              icon={<Package />}
              color="blue"
            />
            <DashboardCard
              title="Transactions"
              value={dashboardData.totalTransactions}
              icon={<RefreshCw />}
              color="indigo"
            />
            <DashboardCard
              title="Vendors"
              value={dashboardData.totalVendors}
              icon={<Truck />}
              color="red"
            />
            <DashboardCard
              title="Warehouses"
              value={dashboardData.totalWarehouses}
              icon={<Warehouse />}
              color="yellow"
            />
            <DashboardCard
              title="Inventory Value"
              value={dashboardData.inventoryValuation}
              icon={<DollarSign />}
              color="purple"
              prefix="₹"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Transactions by Type
                </h3>
                <Bar
                  data={transactionsByTypeData}
                  options={{
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: true,
                  }}
                />
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Inventory by Warehouse
                </h2>
                <Pie
                  data={inventoryByWarehouseData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="recent-activity bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
              <div
                className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded shadow"
                style={{ maxHeight: '300px' }}
              >
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded shadow-sm border border-gray-200"
                    >
                      {activity.type === 'Transaction' ? (
                        <div>
                          <p>
                            <strong>Product Name:</strong> {activity.productName}
                          </p>
                          <p>
                            <strong>Qty:</strong> {activity.quantity}
                          </p>
                          <p>
                            <strong>Adjustment Type:</strong> {activity.adjustmentType}
                          </p>
                          <p>
                            <strong>Adjusted On:</strong>{' '}
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ) : activity.type === 'ADD-SKU' ? (
                        <div>
                          <p>
                            <strong>SKU Name:</strong> {activity.skuName}
                          </p>
                          <p>
                            <strong>Added On:</strong>{' '}
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent activities in the last 24 hours.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Inventory Growth Visualizations
            </h2>
            <div className="grid grid-cols-1 md">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">Line Chart</h3>
                <Line
                  data={growthChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Inventory Growth (Line Chart)',
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Units',
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Month',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <StockTable title="Low Stock Alerts" data={dashboardData.lowStock} type="low" />
            <StockTable title="Over Stock Alerts" data={dashboardData.overStock} type="over" />
          </div>
        </>
      )}
    </div>
  );
}