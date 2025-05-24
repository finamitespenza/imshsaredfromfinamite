import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { PlusCircle, FileSpreadsheet, File as FilePdf, FileText, X, Building2 } from 'lucide-react';
import { AddWarehouseModal } from '../components/modals/AddWarehouseModal';
import { EditWarehouseModal } from '../components/modals/EditWarehouseModal';

export function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [warehouseSearchInput, setWarehouseSearchInput] = useState('');
  const [managerFilter, setManagerFilter] = useState('');
  
  // Dropdown options
  const [managerOptions, setManagerOptions] = useState([]);

  useEffect(() => {
    fetchWarehouses();
    fetchManagerNames();
  }, []);

  useEffect(() => {
    filterWarehouses();
  }, [warehouses, warehouseSearchInput, managerFilter]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await api.getWarehouseData();
      setWarehouses(response);
      setFilteredWarehouses(response);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
    setLoading(false);
  };

  const fetchManagerNames = async () => {
    try {
      const response = await api.getManagerNames();
      setManagerOptions(response);
    } catch (error) {
      console.error('Failed to fetch manager names:', error);
    }
  };

  const filterWarehouses = () => {
    let filtered = [...warehouses];

    if (warehouseSearchInput) {
      filtered = filtered.filter(w => w.vendorName && w.vendorName.toLowerCase() === warehouseSearchInput.toLowerCase());
    }
    
    if (managerFilter) {
      filtered = filtered.filter(w => w.managerName && w.managerName.toLowerCase() === managerFilter.toLowerCase());
    }

    setFilteredWarehouses(filtered);
  };

  const resetFilters = () => {
    setWarehouseSearchInput('');
    setManagerFilter('');
    setFilteredWarehouses(warehouses);
  };

  const handleAddWarehouse = async (warehouseData) => {
    try {
      await api.addWarehouse(warehouseData);
      await fetchWarehouses();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add warehouse:', error);
    }
  };

  const handleEditWarehouse = async (warehouseData) => {
    try {
      await api.updateWarehouse(warehouseData);
      await fetchWarehouses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update warehouse:', error);
    }
  };

  const openEditModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditModalOpen(true);
  };

  const exportTable = (format) => {
    api.exportTable('warehouseTable', format, filteredWarehouses);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <Building2 className="text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Warehouse Master</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <PlusCircle className="mr-2" size={18} /> Add Warehouse
          </button>
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2" 
            onClick={resetFilters}
          >
            <X className="mr-2" size={18} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="w-full">
            <label htmlFor="warehouseSearchInput" className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
            <div className="relative">
              <input 
                type="text" 
                id="warehouseSearchInput" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by name..." 
                value={warehouseSearchInput}
                onChange={(e) => setWarehouseSearchInput(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="managerFilter" className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
            <div className="relative">
              <select 
                id="managerFilter" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm transition duration-200" 
                value={managerFilter}
                onChange={(e) => setManagerFilter(e.target.value)}
              >
                <option value="">All Managers</option>
                {managerOptions.map((manager, index) => (
                  <option key={index} value={manager}>{manager}</option>
                ))}
              </select>
            </div>
          </div>
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
          <div className="p-1" style={{ maxHeight: '750px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table id="warehouseTable" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWarehouses.length > 0 ? (
                    filteredWarehouses.map((warehouse, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{warehouse.srNo}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{warehouse.vendorName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{warehouse.location}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{warehouse.managerName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{warehouse.addedOn}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                          <button 
                            className="action-button edit bg-indigo-600 text-white px-2 py-1 rounded mr-1 hover:bg-indigo-700 transition-colors"
                            onClick={() => openEditModal(warehouse)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                        No warehouses found matching the filters
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
        <AddWarehouseModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddWarehouse}
        />
      )}
      
      {isEditModalOpen && selectedWarehouse && (
        <EditWarehouseModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditWarehouse}
          warehouse={selectedWarehouse}
        />
      )}
    </div>
  );
}