import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getUniqueSKUs, getUniqueItemNames } from '../../utils/api';

interface AddAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddAdjustmentModal({ isOpen, onClose, onSubmit }: AddAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    sku: '',
    qty: '',
    type: '',
    remarks: ''
  });
  
  const [skuOptions, setSkuOptions] = useState([]);
  const [itemNameOptions, setItemNameOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const skus = await getUniqueSKUs();
        const itemNames = await getUniqueItemNames();
        setSkuOptions(skus);
        setItemNameOptions(itemNames);
      } catch (error) {
        console.error('Failed to fetch options:', error);
      }
    };
    
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'itemName' && value) {
      // Find matching SKU
      const matchingSku = skuOptions.find(sku => {
        const skuItem = skuOptions.find(s => s.itemName === value);
        return skuItem ? skuItem.sku : null;
      });
      
      if (matchingSku) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          sku: matchingSku
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'sku' && value) {
      // Find matching item name
      const matchingItem = itemNameOptions.find(item => {
        const itemSku = skuOptions.find(s => s.sku === value);
        return itemSku ? itemSku.itemName : null;
      });
      
      if (matchingItem) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          itemName: matchingItem
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 max-w-4xl transform transition-all duration-300 scale-100 opacity-100">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Add Stock Adjustment
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input 
                type="text" 
                name="itemName" 
                list="itemNameList"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Enter item name" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                required 
              />
              <datalist id="itemNameList">
                {itemNameOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input 
                type="text" 
                name="sku" 
                list="skuList"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU code" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                required 
              />
              <datalist id="skuList">
                {skuOptions.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input 
                type="number" 
                name="qty" 
                value={formData.qty}
                onChange={handleChange}
                placeholder="Enter quantity" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
              <select 
                name="type" 
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                required
              >
                <option value="">Select Type</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea 
                name="remarks" 
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks (optional)" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                rows={3}
              ></textarea>
            </div>
            
            {/* Footer buttons */}
            <div className="pt-5 border-t border-gray-200 flex justify-end space-x-4">
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
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Adjustment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
