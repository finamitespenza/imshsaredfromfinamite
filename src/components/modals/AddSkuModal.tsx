import { useState } from 'react';
import { X } from 'lucide-react';

interface AddSkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  warehouseOptions: string[];
  vendorOptions: string[];
}

export function AddSkuModal({ isOpen, onClose, onSubmit, warehouseOptions, vendorOptions }: AddSkuModalProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    sku: '',
    uom: '',
    minLvl: '',
    maxLvl: '',
    reorderQty: '',
    warehouse: '',
    location: '',
    openingStock: '',
    price: '',
    vendor1: '',
    vendor2: '',
    vendor3: '',
    vendor4: '',
    vendor5: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-10/12 lg:w-9/12 xl:w-3/4 max-w-6xl transform transition-all duration-300 scale-100 opacity-100">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-700 rounded-t-2xl p-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Add New SKU
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Modal body */}
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[68vh] pr-1">
            {/* Basic Information */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input 
                    type="text" 
                    name="itemName" 
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="Enter item name" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Enter SKU code" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">UOM</label>
                  <input 
                    type="text" 
                    name="uom" 
                    value={formData.uom}
                    onChange={handleChange}
                    placeholder="Unit of Measure" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Inventory Settings */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center">
                <div className="bg-green-100 text-green-600 p-1.5 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Inventory Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Min Level</label>
                  <input 
                    type="number" 
                    name="minLvl" 
                    value={formData.minLvl}
                    onChange={handleChange}
                    placeholder="0" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Max Level</label>
                  <input 
                    type="number" 
                    name="maxLvl" 
                    value={formData.maxLvl}
                    onChange={handleChange}
                    placeholder="100" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Reorder Qty</label>
                  <input 
                    type="number" 
                    name="reorderQty" 
                    value={formData.reorderQty}
                    onChange={handleChange}
                    placeholder="25" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Opening Stock</label>
                  <input 
                    type="number" 
                    name="openingStock" 
                    value={formData.openingStock}
                    onChange={handleChange}
                    placeholder="50" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center">
                <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Warehouse</label>
                  <div className="relative">
                    <select
                      name="warehouse"
                      value={formData.warehouse}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white"
                      
                    >
                      <option value="">Select warehouse</option>
                      {warehouseOptions.map((warehouse, index) => (
                        <option key={index} value={warehouse}>{warehouse}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Financial Details */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center">
                <div className="bg-amber-100 text-amber-600 p-1.5 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Financial Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">₹</span>
                    </div>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200 bg-white" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vendor Information */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center">
                <div className="bg-purple-100 text-purple-600 p-1.5 rounded-md mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                Vendor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Primary Vendor</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="vendor1" 
                      value={formData.vendor1}
                      onChange={handleChange}
                      placeholder="Primary vendor" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Secondary Vendor</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="vendor2" 
                      value={formData.vendor2}
                      onChange={handleChange}
                      placeholder="Secondary vendor" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tertiary Vendor</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="vendor3" 
                      value={formData.vendor3}
                      onChange={handleChange}
                      placeholder="Tertiary vendor" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Alternative Vendor 1</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="vendor4" 
                      value={formData.vendor4}
                      onChange={handleChange}
                      placeholder="Alternative vendor 1" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Alternative Vendor 2</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="vendor5" 
                      value={formData.vendor5}
                      onChange={handleChange}
                      placeholder="Alternative vendor 2" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer buttons */}
            <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 flex items-center justify-center"
              >
                <X className="h-5 w-5 mr-1.5 text-gray-500" />
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add SKU
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}