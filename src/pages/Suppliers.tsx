import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { PlusCircle, FileSpreadsheet, File as FilePdf, FileText, X, Truck } from 'lucide-react';
import { AddSupplierModal } from '../components/modals/AddSupplierModal';
import { EditSupplierModal } from '../components/modals/EditSupplierModal';

export function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [supplierSearchInput, setSupplierSearchInput] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, supplierSearchInput, cityFilter, stateFilter]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.getSuppliers();
      setSuppliers(response);
      setFilteredSuppliers(response);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
    setLoading(false);
  };

  const filterSuppliers = () => {
    let filtered = [...suppliers];

    if (supplierSearchInput) {
      filtered = filtered.filter(s => (s.SupplierName || '').toLowerCase() === supplierSearchInput.toLowerCase());
    }
    
    if (cityFilter) {
      filtered = filtered.filter(s => (s.City || '').toLowerCase() === cityFilter.toLowerCase());
    }
    
    if (stateFilter) {
      filtered = filtered.filter(s => (s.State || '').toLowerCase() === stateFilter.toLowerCase());
    }

    setFilteredSuppliers(filtered);
  };

  const resetFilters = () => {
    setSupplierSearchInput('');
    setCityFilter('');
    setStateFilter('');
    setFilteredSuppliers(suppliers);
  };

  const handleAddSupplier = async (supplierData) => {
    try {
      await api.addSupplier(supplierData);
      await fetchSuppliers();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  const handleEditSupplier = async (supplierData) => {
    try {
      await api.updateSupplier(supplierData);
      await fetchSuppliers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const exportTable = (format) => {
    api.exportTable('supplierTable', format, filteredSuppliers);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <Truck className="text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Supplier Master</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <PlusCircle className="mr-2" size={18} /> Add Supplier
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="w-full">
            <label htmlFor="supplierSearchInput" className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <div className="relative">
              <input 
                type="text" 
                id="supplierSearchInput" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by name..." 
                value={supplierSearchInput}
                onChange={(e) => setSupplierSearchInput(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="relative">
              <input 
                type="text" 
                id="cityFilter" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by city..." 
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="stateFilter" className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <div className="relative">
              <input 
                type="text" 
                id="stateFilter" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by state..." 
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              />
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
              <table id="supplierTable" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address Line 1</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address Line 2</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address Line 3</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Whatsapp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.DateAdded || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.SupplierID || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.SupplierName || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.ContactPersonName || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.ContactNumber || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.AddressLine1 || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.AddressLine2 || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.AddressLine3 || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.City || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.State || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.PINCode || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.GSTNo || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.EmailID || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplier.WhatsAppNo || ''}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs">
                          <button 
                            className="action-button edit bg-indigo-600 text-white px-2 py-1 rounded mr-1 hover:bg-indigo-700 transition-colors"
                            onClick={() => openEditModal(supplier)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="px-4 py-2 text-center text-gray-500">
                        No suppliers found matching the filters
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
        <AddSupplierModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleAddSupplier}
        />
      )}
      
      {isEditModalOpen && selectedSupplier && (
        <EditSupplierModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSubmit={handleEditSupplier}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
}