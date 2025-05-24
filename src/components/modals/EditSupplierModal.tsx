import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  supplier: any;
}

export function EditSupplierModal({ isOpen, onClose, onSubmit, supplier }: EditSupplierModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    supplierName: '',
    contactPersonName: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    state: '',
    pinCode: '',
    gstNo: '',
    emailId: '',
    whatsappNo: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        id: supplier.SupplierID,
        supplierName: supplier.SupplierName || '',
        contactPersonName: supplier.ContactPersonName || '',
        contactNumber: supplier.ContactNumber || '',
        addressLine1: supplier.AddressLine1 || '',
        addressLine2: supplier.AddressLine2 || '',
        addressLine3: supplier.AddressLine3 || '',
        city: supplier.City || '',
        state: supplier.State || '',
        pinCode: supplier.PINCode || '',
        gstNo: supplier.GSTNo || '',
        emailId: supplier.EmailID || '',
        whatsappNo: supplier.WhatsAppNo || ''
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchPincodeDetails = async () => {
    const pinCode = formData.pinCode;
    if (pinCode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = await response.json();
        if (data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.Block || postOffice.Name,
            state: postOffice.State
          }));
        }
      } catch (error) {
        console.error('Error fetching PIN code details:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-5xl transform transition-all duration-300 scale-100 opacity-100">
        {/* Modal header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-t-2xl p-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Edit Supplier: {supplier?.SupplierName}
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
            <input type="hidden" name="id" value={formData.id} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                <input 
                  type="text" 
                  name="supplierName" 
                  value={formData.supplierName}
                  onChange={handleChange}
                  placeholder="Enter supplier name" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact Person Name</label>
                <input 
                  type="text" 
                  name="contactPersonName" 
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  placeholder="Enter contact person name" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input 
                  type="text" 
                  name="contactNumber" 
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input 
                  type="text" 
                  name="addressLine1" 
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Enter address line 1" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input 
                  type="text" 
                  name="addressLine2" 
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Enter address line 2" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Address Line 3</label>
                <input 
                  type="text" 
                  name="addressLine3" 
                  value={formData.addressLine3}
                  onChange={handleChange}
                  placeholder="Enter address line 3" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                <input 
                  type="text" 
                  name="pinCode" 
                  value={formData.pinCode}
                  onChange={handleChange}
                  onBlur={fetchPincodeDetails}
                  placeholder="Enter PIN code" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input 
                  type="text" 
                  name="state" 
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">GST No.</label>
                <input 
                  type="text" 
                  name="gstNo" 
                  value={formData.gstNo}
                  onChange={handleChange}
                  placeholder="Enter GST number" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email ID</label>
                <input 
                  type="email" 
                  name="emailId" 
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="Enter email address" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">WhatsApp No.</label>
                <input 
                  type="text" 
                  name="whatsappNo" 
                  value={formData.whatsappNo}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-white" 
                  required 
                />
              </div>
            </div>
            
            {/* Footer buttons */}
            <div className="pt-5 mt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
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
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 shadow-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Update Supplier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}