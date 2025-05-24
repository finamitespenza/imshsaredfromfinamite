import { useState } from 'react';
import { api } from '../utils/api';
import { BarChart3, FileSpreadsheet, File as FilePdf, FileText } from 'lucide-react';

export function Reports() {
  const [activeReport, setActiveReport] = useState('stockAging');
  const [stockAgingData, setStockAgingData] = useState([]);
  const [salesDispatchData, setSalesDispatchData] = useState([]);
  const [salesReturnData, setSalesReturnData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states for Sales Dispatch Report
  const [salesOrderFilter, setSalesOrderFilter] = useState('');
  const [itemNameDispatchFilter, setItemNameDispatchFilter] = useState('');
  const [skuDispatchFilter, setSkuDispatchFilter] = useState('');
  const [statusDispatchFilter, setStatusDispatchFilter] = useState('');
  const [dispatchStartDate, setDispatchStartDate] = useState('');
  const [dispatchEndDate, setDispatchEndDate] = useState('');
  
  // Filter states for Sales Return Report
  const [returnIdFilter, setReturnIdFilter] = useState('');
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [itemNameReturnFilter, setItemNameReturnFilter] = useState('');
  const [skuReturnFilter, setSkuReturnFilter] = useState('');
  const [statusReturnFilter, setStatusReturnFilter] = useState('');
  const [returnStartDate, setReturnStartDate] = useState('');
  const [returnEndDate, setReturnEndDate] = useState('');

  const generateStockAgingReport = async () => {
    setLoading(true);
    try {
      const response = await api.getStockAgingReport();
      setStockAgingData(response);
      setActiveReport('stockAging');
    } catch (error) {
      console.error('Failed to generate Stock Aging Report:', error);
    }
    setLoading(false);
  };

  const generateSalesDispatchReport = async () => {
    setLoading(true);
    try {
      const response = await api.getSalesDispatchReport();
      setSalesDispatchData(response);
      setActiveReport('salesDispatch');
    } catch (error) {
      console.error('Failed to generate Sales Dispatch Report:', error);
    }
    setLoading(false);
  };

  const generateSalesReturnReport = async () => {
    setLoading(true);
    try {
      const response = await api.getSalesReturnReport();
      setSalesReturnData(response);
      setActiveReport('salesReturn');
    } catch (error) {
      console.error('Failed to generate Sales Return Report:', error);
    }
    setLoading(false);
  };

  const applySalesDispatchFilters = () => {
    // Implementation for filtering sales dispatch report
  };

  const resetSalesDispatchFilters = () => {
    setSalesOrderFilter('');
    setItemNameDispatchFilter('');
    setSkuDispatchFilter('');
    setStatusDispatchFilter('');
    setDispatchStartDate('');
    setDispatchEndDate('');
    applySalesDispatchFilters();
  };

  const applySalesReturnFilters = () => {
    // Implementation for filtering sales return report
  };

  const resetSalesReturnFilters = () => {
    setReturnIdFilter('');
    setOrderIdFilter('');
    setCustomerNameFilter('');
    setItemNameReturnFilter('');
    setSkuReturnFilter('');
    setStatusReturnFilter('');
    setReturnStartDate('');
    setReturnEndDate('');
    applySalesReturnFilters();
  };

  const exportTable = (tableId, format) => {
    let data;
    if (tableId === 'stockAgingReportTable') {
      data = stockAgingData;
    } else if (tableId === 'salesDispatchReportTable') {
      data = salesDispatchData;
    } else if (tableId === 'salesReturnReportTable') {
      data = salesReturnData;
    }
    
    api.exportTable(tableId, format, data);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 p-2 rounded-lg">
            <BarChart3 className="text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center ${activeReport === 'stockAging' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={generateStockAgingReport}
          >
            <BarChart3 className="mr-2" size={18} /> Stock Aging Report
          </button>
          <button 
            className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center ${activeReport === 'salesDispatch' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={generateSalesDispatchReport}
          >
            <BarChart3 className="mr-2" size={18} /> Sales Dispatch Report
          </button>
          <button 
            className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center ${activeReport === 'salesReturn' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            onClick={generateSalesReturnReport}
          >
            <BarChart3 className="mr-2" size={18} /> Sales Return Report
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      {activeReport && (
        <div className="flex justify-center mt-4 mb-6">
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 mx-2" 
            onClick={() => exportTable(`${activeReport}ReportTable`, 'csv')}
          >
            <FileText className="mr-2" size={18} />
            <span>Export CSV</span>
          </button>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 mx-2" 
            onClick={() => exportTable(`${activeReport}ReportTable`, 'excel')}
          >
            <FileSpreadsheet className="mr-2" size={18} />
            <span>Export Excel</span>
          </button>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 mx-2" 
            onClick={() => exportTable(`${activeReport}ReportTable`, 'pdf')}
          >
            <FilePdf className="mr-2" size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      )}

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Stock Aging Report */}
          {activeReport === 'stockAging' && (
            <div className="bg-white shadow-md rounded my-6 overflow-y-auto p-6" style={{ maxHeight: '750px' }}>
              <h3 className="text-xl font-semibold mb-4">Stock Aging Report</h3>
              <table id="stockAgingReportTable" className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Since Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Transaction On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Since Last Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Transactions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockAgingData.length > 0 ? (
                    stockAgingData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.addedOn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.daysSinceAdded}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.lastTransactionOn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.daysSinceLastTransaction}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalTransactions}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        No data available. Click "Stock Aging Report" to generate the report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Sales Dispatch Report */}
          {activeReport === 'salesDispatch' && (
            <div className="bg-white shadow-md rounded my-6 overflow-y-auto p-6" style={{ maxHeight: '750px' }}>
              <h3 className="text-xl font-semibold mb-4">Sales Dispatch Report</h3>
              
              {/* Filters for Sales Dispatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by Sales Order" 
                    value={salesOrderFilter}
                    onChange={(e) => setSalesOrderFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by Item Name" 
                    value={itemNameDispatchFilter}
                    onChange={(e) => setItemNameDispatchFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by SKU" 
                    value={skuDispatchFilter}
                    onChange={(e) => setSkuDispatchFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    value={statusDispatchFilter}
                    onChange={(e) => setStatusDispatchFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Partially">Partially</option>
                    <option value="Dispatched">Dispatched</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input 
                    type="date" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    value={dispatchStartDate}
                    onChange={(e) => setDispatchStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input 
                    type="date" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    value={dispatchEndDate}
                    onChange={(e) => setDispatchEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg flex items-center" 
                    onClick={resetSalesDispatchFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
              
              <table id="salesDispatchReportTable" className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesDispatchData.length > 0 ? (
                    salesDispatchData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.salesOrder}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.dispatchQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.remainingQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.dispatchDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        No data available. Click "Sales Dispatch Report" to generate the report.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Sales Return Report */}
          {activeReport === 'salesReturn' && (
            <div className="bg-white shadow-md rounded my-6 overflow-y-auto p-6" style={{ maxHeight: '750px' }}>
              <h3 className="text-xl font-semibold mb-4">Sales Return Report</h3>
              
              {/* Filters for Sales Return */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return ID</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by Return ID" 
                    value={returnIdFilter}
                    onChange={(e) => setReturnIdFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by Order ID" 
                    value={orderIdFilter}
                    onChange={(e) => setOrderIdFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by Customer Name" 
                    value={customerNameFilter}
                    onChange={(e) => setCustomerNameFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by Item Name" 
                    value={itemNameReturnFilter}
                    onChange={(e) => setItemNameReturnFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input 
                    type="text" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    placeholder="Search by SKU" 
                    value={skuReturnFilter}
                    onChange={(e) => setSkuReturnFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    value={statusReturnFilter}
                    onChange={(e) => setStatusReturnFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input 
                    type="date" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    value={returnStartDate}
                    onChange={(e) => setReturnStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input 
                    type="date" 
                    className="form-control rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm" 
                    value={returnEndDate}
                    onChange={(e) => setReturnEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg flex items-center" 
                    onClick={resetSalesReturnFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table id="salesReturnReportTable" className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50 sticky top-0 z-5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesReturnData.length > 0 ? (
                      salesReturnData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.returnId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.orderId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.itemName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.sku}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.remainingUnits}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.dispatchUnits}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.returnUnits}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.remark}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.returnDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.returnAction}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
                          No data available. Click "Sales Return Report" to generate the report.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}