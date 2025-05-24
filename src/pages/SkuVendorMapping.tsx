import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { RefreshCw, Link, X } from 'lucide-react';

export function SkuVendorMapping() {
  const [skus, setSkus] = useState([]);
  const [filteredSkus, setFilteredSkus] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Original data for comparison to detect changes
  const [originalSkuData, setOriginalSkuData] = useState({});
  
  // Filter states
  const [skuSearchInput, setSkuSearchInput] = useState('');
  const [itemSearchInput, setItemSearchInput] = useState('');

  useEffect(() => {
    loadSKUsForVendorMapping();
    loadVendorOptions();
  }, []);

  useEffect(() => {
    filterSKUsForVendorMapping();
  }, [skus, skuSearchInput, itemSearchInput]);

  const loadSKUsForVendorMapping = async () => {
    setLoading(true);
    try {
      const response = await api.getSKUsForVendorMapping();
      setSkus(response);
      setFilteredSkus(response);
      
      // Store original data for change detection
      const originalData = {};
      response.forEach(sku => {
        originalData[sku.sku] = {
          vendor1: sku.vendor1 || '',
          vendor2: sku.vendor2 || '',
          vendor3: sku.vendor3 || '',
          vendor4: sku.vendor4 || '',
          vendor5: sku.vendor5 || ''
        };
      });
      setOriginalSkuData(originalData);
    } catch (error) {
      console.error('Failed to load SKUs for vendor mapping:', error);
    }
    setLoading(false);
  };

  const loadVendorOptions = async () => {
    try {
      const response = await api.getVendorNames();
      setVendorOptions(response);
    } catch (error) {
      console.error('Failed to load vendor options:', error);
    }
  };

  const filterSKUsForVendorMapping = () => {
    let filtered = [...skus];

    if (skuSearchInput) {
      filtered = filtered.filter(sku => String(sku.sku).toLowerCase() === skuSearchInput.toLowerCase());
    }
    
    if (itemSearchInput) {
      filtered = filtered.filter(sku => sku.itemName.toLowerCase() === itemSearchInput.toLowerCase());
    }

    setFilteredSkus(filtered);
  };

  const resetVendorMappingFilters = () => {
    setSkuSearchInput('');
    setItemSearchInput('');
    setFilteredSkus(skus);
  };

  const handleVendorChange = (sku, vendorNumber, newValue) => {
    const updatedSkus = skus.map(item => {
      if (item.sku === sku) {
        return {
          ...item,
          [`vendor${vendorNumber}`]: newValue
        };
      }
      return item;
    });
    
    setSkus(updatedSkus);
    
    // Check if there are any changes compared to original data
    const hasAnyChanges = updatedSkus.some(item => {
      const original = originalSkuData[item.sku];
      if (!original) return false;
      
      return (
        original.vendor1 !== (item.vendor1 || '') ||
        original.vendor2 !== (item.vendor2 || '') ||
        original.vendor3 !== (item.vendor3 || '') ||
        original.vendor4 !== (item.vendor4 || '') ||
        original.vendor5 !== (item.vendor5 || '')
      );
    });
    
    setHasChanges(hasAnyChanges);
  };

  const saveVendorMappings = async () => {
    try {
      const mappings = skus.map(sku => ({
        sku: sku.sku,
        V1: sku.vendor1 || '',
        V2: sku.vendor2 || '',
        V3: sku.vendor3 || '',
        V4: sku.vendor4 || '',
        V5: sku.vendor5 || ''
      }));
      
      await api.saveVendorMappings(mappings);
      
      // Update original data after save
      const newOriginalData = {};
      skus.forEach(sku => {
        newOriginalData[sku.sku] = {
          vendor1: sku.vendor1 || '',
          vendor2: sku.vendor2 || '',
          vendor3: sku.vendor3 || '',
          vendor4: sku.vendor4 || '',
          vendor5: sku.vendor5 || ''
        };
      });
      
      setOriginalSkuData(newOriginalData);
      setHasChanges(false);
      
      // Show success message
      alert('Vendor mappings saved successfully');
    } catch (error) {
      console.error('Failed to save vendor mappings:', error);
      alert('Failed to save vendor mappings');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 p-2 rounded-lg shadow-md">
            <Link className="text-white" />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">SKU to Vendor Mapping</h2>
        </div>
        <button 
          id="refreshVendorMappingButton" 
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center" 
          onClick={loadSKUsForVendorMapping}
        >
          <RefreshCw className="mr-2" size={18} /> Refresh
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 my-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full md:w-auto flex-1">
            <label htmlFor="skuSearchInputMapping" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <div className="relative">
              <input 
                type="text" 
                id="skuSearchInputMapping" 
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by SKU..." 
                value={skuSearchInput}
                onChange={(e) => setSkuSearchInput(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto flex-1">
            <label htmlFor="itemSearchInputMapping" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <div className="relative">
              <input 
                type="text" 
                id="itemSearchInputMapping"  
                className="form-control rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full pl-3 pr-3 py-2 text-sm placeholder-gray-500 transition duration-200" 
                placeholder="Search by Item Name..." 
                value={itemSearchInput}
                onChange={(e) => setItemSearchInput(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <button 
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2" 
              onClick={resetVendorMappingFilters}
            >
              <X className="mr-2" size={18} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <button 
            id="saveVendorMappingButton" 
            className={`bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={saveVendorMappings}
            disabled={!hasChanges}
          >
            <i className="fas fa-save mr-2"></i> Save Changes
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-lg rounded-lg my-6 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="p-1" style={{ maxHeight: '750px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <table id="skuVendorMappingTable" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor 1</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor 2</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor 3</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor 4</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor 5</th>
                  </tr>
                </thead>
                <tbody id="skuVendorMappingTableBody" className="bg-white divide-y divide-gray-200">
                  {filteredSkus.length > 0 ? (
                    filteredSkus.map((sku, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.id}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{sku.itemName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{sku.sku}</td>
                        <td className="px-4 py-2">
                          <input 
                            list="vendors"
                            className="vendor-input rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm transition-all duration-200"
                            value={sku.vendor1 || ''}
                            onChange={(e) => handleVendorChange(sku.sku, 1, e.target.value)}
                            placeholder="Select vendor..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            list="vendors"
                            className="vendor-input rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm transition-all duration-200"
                            value={sku.vendor2 || ''}
                            onChange={(e) => handleVendorChange(sku.sku, 2, e.target.value)}
                            placeholder="Select vendor..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            list="vendors"
                            className="vendor-input rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm transition-all duration-200"
                            value={sku.vendor3 || ''}
                            onChange={(e) => handleVendorChange(sku.sku, 3, e.target.value)}
                            placeholder="Select vendor..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            list="vendors"
                            className="vendor-input rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm transition-all duration-200"
                            value={sku.vendor4 || ''}
                            onChange={(e) => handleVendorChange(sku.sku, 4, e.target.value)}
                            placeholder="Select vendor..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            list="vendors"
                            className="vendor-input rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full px-3 py-2 text-sm transition-all duration-200"
                            value={sku.vendor5 || ''}
                            onChange={(e) => handleVendorChange(sku.sku, 5, e.target.value)}
                            placeholder="Select vendor..."
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                        No SKUs found matching the filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            
            {/* Vendor datalist for dropdowns */}
            <datalist id="vendors">
              {vendorOptions.map((vendor, index) => (
                <option key={index} value={vendor} />
              ))}
            </datalist>
          </div>
        </div>
      </div>
      
      {/* Enhanced styling for vendor input fields */}
      <style jsx>{`
        .vendor-input {
          transition: all 0.2s ease-in-out;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 0.5rem;
          width: 100%;
          font-size: 0.875rem;
        }
        
        .vendor-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        
        /* Highlight empty vendor inputs */
        .vendor-input:placeholder-shown {
          background-color: #f9fafb;
          border: 1px dashed #cbd5e1;
        }
        
        /* Zebra striping for better readability */
        #skuVendorMappingTableBody tr:nth-child(even) {
          background-color: #f8fafc;
        }
        
        #skuVendorMappingTableBody tr:hover {
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}