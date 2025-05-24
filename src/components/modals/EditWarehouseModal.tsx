import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  warehouse: any;
}

export function EditWarehouseModal({ isOpen, onClose, onSubmit, warehouse }: EditWarehouseModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    vendorName: '',
    location: '',
    managerName: ''
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        id: warehouse.srNo,
        vendorName: warehouse.vendorName,
        location: warehouse.location,
        managerName: warehouse.managerName
      });
    }
  }, [warehouse]);

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
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-t-2xl p-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Edit Warehouse: {warehouse?.vendorName}
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
            <input type="hidden" name="id" value={formData.id} />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
              <input 
                type="text" 
                name="vendorName" 
                value={formData.vendorName}
                onChange={handleChange}
                placeholder="Enter warehouse name" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Manager Name</label>
              <input 
                type="text" 
                name="managerName" 
                value={formData.managerName}
                onChange={handleChange}
                placeholder="Enter manager name" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white" 
                required 
              />
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
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Update Warehouse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}