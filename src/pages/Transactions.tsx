import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { PlusCircle, Upload, FileSpreadsheet, File as FilePdf, FileText, X, RefreshCw } from 'lucide-react';
import { AddAdjustmentModal } from '../components/modals/AddAdjustmentModal';

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [transactionSearchInput, setTransactionSearchInput] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('');
  const [transactionStartDate, setTransactionStartDate] = useState('');
  const [transactionEndDate, setTransactionEndDate] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyTransactionFilters();
  }, [transactions, transactionSearchInput, transactionTypeFilter, transactionStartDate, transactionEndDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.getTransactions();
      setTransactions(response);
      setFilteredTransactions(response);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
    setLoading(false);
  };

  const applyTransactionFilters = () => {
    let filtered = [...transactions];

    if (transactionSearchInput) {
      filtered = filtered.filter(t => t[2].toLowerCase().includes(transactionSearchInput.toLowerCase()));
    }
    
    if (transactionTypeFilter) {
      filtered = filtered.filter(t => t[5] === transactionTypeFilter);
    }
    
    if (transactionStartDate && transactionEndDate) {
      const start = new Date(transactionStartDate);
      const end = new Date(transactionEndDate);
      
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t[0]);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  };

  const resetTransactionFilters = () => {
    setTransactionSearchInput('');
    setTransactionTypeFilter('');
    setTransactionStartDate('');
    setTransactionEndDate('');
    setFilteredTransactions(transactions);
  };

  const handleAddAdjustment = async (adjustmentData) => {
    try {
      await api.addStockAdjustment(adjustmentData);
      await fetchTransactions();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add adjustment:', error);
    }
  };

  const exportTable = (format) => {
    api.exportTable('transactionTable', format, filteredTransactions);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <RefreshCw className="text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Transactions</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <PlusCircle className="mr-2" size={18} /> Add Adjustment
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <Upload className="mr-2" size={18} /> Import Transactions
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="w-full">
            <label htmlFor="transactionSearchInput" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <div className="relative">
              <input 
                type="text" 
                id="transactionSearchInput" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by Item Name" 
                value={transactionSearchInput}
                onChange={(e) => setTransactionSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="transactionTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <div className="relative">
              <select 
                id="transactionTypeFilter" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm transition duration-200" 
                value={transactionTypeFilter}
                onChange={(e) => setTransactionTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Adjusted In">Adjusted In</option>
                <option value="Adjusted Out">Adjusted Out</option>
                <option value="Purchase">Purchase</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="transactionStartDate" className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <input 
                type="date" 
                id="transactionStartDate" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm transition duration-200" 
                value={transactionStartDate}
                onChange={(e) => setTransactionStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="transactionEndDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <input 
                type="date" 
                id="transactionEndDate" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm transition duration-200" 
                value={transactionEndDate}
                onChange={(e) => setTransactionEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2" 
            onClick={resetTransactionFilters}
          >
            <X className="mr-2" size={18} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center" 
          onClick={() => exportTable('csv')}
        >
          <FileText className="mr-2" size={18} />
          <span>Export CSV</span>
        </button>
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center" 
          onClick={() => exportTable('excel')}
        >
          <FileSpreadsheet className="mr-2" size={18} />
          <span>Export Excel</span>
        </button>
        <button 
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center" 
          onClick={() => exportTable('pdf')}
        >
          <FilePdf className="mr-2" size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg my-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="p-1" style={{ maxHeight: '650px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table id="transactionTable" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Nature</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {transaction.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {cell || ''}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                        No transactions found matching the filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddAdjustmentModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddAdjustment}
        />
      )}
    </div>
  );
}