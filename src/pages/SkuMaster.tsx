import { useState, useEffect } from 'react';
import {
  getSKUs,
  addSKU,
  updateSKU,
  deleteSKU,
  exportTable,
  // add other needed functions here
} from '../utils/api';
import { PackagePlus, Upload, FileSpreadsheet, FileText, X, Package } from 'lucide-react';
import { AddSkuModal } from '../components/modals/AddSkuModal';
import { EditSkuModal } from '../components/modals/EditSkuModal';

export function SkuMaster() {
  const [skus, setSkus] = useState([]);
  const [filteredSkus, setFilteredSkus] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [skuSearchInput, setSkuSearchInput] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [itemSearchInput, setItemSearchInput] = useState('');
  const [uomFilter, setUomFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Dropdown options
  const [skuOptions, setSkuOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [itemNameOptions, setItemNameOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);

  useEffect(() => {
    fetchSkus();
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    filterSkus();
  }, [skus, skuSearchInput, warehouseFilter, itemSearchInput, uomFilter, statusFilter]);

  const fetchSkus = async () => {
    setLoading(true);
    try {
      const response = await getSKUs();
      setSkus(response);
      setFilteredSkus(response);
    } catch (error) {
      console.error('Failed to fetch SKUs:', error);
    }
    setLoading(false);
  };

  const fetchDropdownOptions = async () => {
    try {
      const skuIds = await api.getUniqueSKUs();
      const warehouses = await api.getUniqueWarehouses();
      const itemNames = await api.getUniqueItemNames();
      const uoms = await api.getUniqueUOMs();
      
      setSkuOptions(skuIds);
      setWarehouseOptions(warehouses);
      setItemNameOptions(itemNames);
      setUomOptions(uoms);
    } catch (error) {
      console.error('Failed to fetch dropdown options:', error);
    }
  };

  const filterSkus = () => {
    let filtered = [...skus];

    if (skuSearchInput) {
      filtered = filtered.filter(sku => sku.sku && sku.sku.toLowerCase() === skuSearchInput.toLowerCase());
    }
    
    if (warehouseFilter) {
      filtered = filtered.filter(sku => sku.warehouse && sku.warehouse.toLowerCase() === warehouseFilter.toLowerCase());
    }
    
    if (itemSearchInput) {
      filtered = filtered.filter(sku => sku.itemName && sku.itemName.toLowerCase() === itemSearchInput.toLowerCase());
    }
    
    if (uomFilter) {
      filtered = filtered.filter(sku => sku.uom && sku.uom.toLowerCase() === uomFilter.toLowerCase());
    }
    
    if (statusFilter) {
      filtered = filtered.filter(sku => sku.status && sku.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredSkus(filtered);
  };

  const resetFilters = () => {
    setSkuSearchInput('');
    setWarehouseFilter('');
    setItemSearchInput('');
    setUomFilter('');
    setStatusFilter('');
    setFilteredSkus(skus);
  };

  const handleAddSku = async (newSkuData) => {
    try {
      await addSKU(newSkuData);
      await fetchSkus();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add SKU:', error);
    }
  };

  const handleEditSku = async (updatedSkuData) => {
    try {
      await updateSKU(updatedSkuData);
      await fetchSkus();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update SKU:', error);
    }
  };

  const handleToggleStatus = async (sku, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await updateSKUStatus(sku, newStatus);
      await fetchSkus();
    } catch (error) {
      console.error('Failed to toggle SKU status:', error);
    }
  };

  const openEditModal = (sku) => {
    setSelectedSku(sku);
    setIsEditModalOpen(true);
  };

  const exportTable = (format) => {
    api.exportTable('skuTable', format, filteredSkus);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <Package className="text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">SKU Master</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <PackagePlus className="mr-2" size={18} /> Add SKU
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <Upload className="mr-2" size={18} /> Import SKUs
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* SKU ID Filter */}
          <div className="w-full">
            <label htmlFor="skuSearchInput" className="block text-sm font-medium text-gray-700 mb-1">SKU ID</label>
            <div className="relative">
              <input 
                type="text" 
                id="skuSearchInput" 
                list="skus" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by SKU ID" 
                value={skuSearchInput}
                onChange={(e) => setSkuSearchInput(e.target.value)}
              />
              <datalist id="skus">
                {skuOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>
          </div>
          
          {/* Warehouse Filter */}
          <div className="w-full">
            <label htmlFor="warehouseFilter" className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <div className="relative">
              <input 
                type="text" 
                id="warehouseFilter" 
                list="warehouses" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by Warehouse" 
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
              />
              <datalist id="warehouses">
                {warehouseOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Item Name Filter */}
          <div className="w-full">
            <label htmlFor="itemSearchInput" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <div className="relative">
              <input 
                type="text" 
                id="itemSearchInput" 
                list="itemNames" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by Item Name" 
                value={itemSearchInput}
                onChange={(e) => setItemSearchInput(e.target.value)}
              />
              <datalist id="itemNames">
                {itemNameOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>
          </div>

          {/* UOM Filter */}
          <div className="w-full">
            <label htmlFor="uomFilter" className="block text-sm font-medium text-gray-700 mb-1">UOM</label>
            <div className="relative">
              <input 
                type="text" 
                id="uomFilter" 
                list="uoms" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by UOM" 
                value={uomFilter}
                onChange={(e) => setUomFilter(e.target.value)}
              />
              <datalist id="uoms">
                {uomOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <select 
                id="statusFilter" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm transition duration-200" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Reset Filter Button */}
        <div className="flex justify-end mt-4">
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2" 
            onClick={resetFilters}
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
          <div className="p-1" style={{ maxHeight: '750px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table id="skuTable" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Lvl</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Lvl</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSkus.length > 0 ? (
                    filteredSkus.map((sku, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{sku.itemName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{sku.sku}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.uom}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.minLvl}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.maxLvl}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.reorderQty}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.warehouse}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.location}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.openingStock}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${parseFloat(sku.price).toFixed(2)}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`status-badge ${sku.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full text-xs font-semibold`}>
                            {sku.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.addedOn}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.currentStock}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                          <button 
                            className="action-button view bg-green-600 text-white px-2 py-1 rounded mr-1 hover:bg-green-700 transition-colors"
                            onClick={() => openEditModal(sku)}
                          >
                            View
                          </button>
                          <button 
                            className="action-button edit bg-indigo-600 text-white px-2 py-1 rounded mr-1 hover:bg-indigo-700 transition-colors"
                            onClick={() => openEditModal(sku)}
                          >
                            Edit
                          </button>
                          <button 
                            className={`action-button ${sku.status === 'Active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-2 py-1 rounded transition-colors`}
                            onClick={() => handleToggleStatus(sku.sku, sku.status)}
                          >
                            {sku.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="px-4 py-2 text-center text-gray-500">
                        No SKUs found matching the filters
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
        <AddSkuModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddSku}
          warehouseOptions={warehouseOptions}
          vendorOptions={[]} // You'll need to fetch these
        />
      )}
      
      {isEditModalOpen && selectedSku && (
        <EditSkuModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditSku}
          sku={selectedSku}
          warehouseOptions={warehouseOptions}
          vendorOptions={[]} // You'll need to fetch these
        />
      )}
    </div>
  );
}