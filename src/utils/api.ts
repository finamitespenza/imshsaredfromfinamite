import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:5000/api';

// --- SKU APIs ---
export async function getSKUs() {
  try {
    const response = await axios.get(`${API_BASE}/skus`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    throw error;
  }
}

export async function addSKU(skuData: any) {
  try {
    const response = await axios.post(`${API_BASE}/skus`, skuData);
    return response.data;
  } catch (error) {
    console.error('Error adding SKU:', error);
    throw error;
  }
}

export async function updateSKU(id: string, skuData: any) {
  try {
    const response = await axios.put(`${API_BASE}/skus/${id}`, skuData);
    return response.data;
  } catch (error) {
    console.error('Error updating SKU:', error);
    throw error;
  }
}

// --- Supplier APIs ---
export async function getSuppliers() {
  try {
    const response = await axios.get(`${API_BASE}/suppliers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

export async function addSupplier(supplierData: any) {
  try {
    const response = await axios.post(`${API_BASE}/suppliers`, supplierData);
    return response.data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
}

export async function updateSupplier(id: string, supplierData: any) {
  try {
    const response = await axios.put(`${API_BASE}/suppliers/${id}`, supplierData);
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}

// --- Warehouse APIs ---
export async function getWarehouses() {
  try {
    const response = await axios.get(`${API_BASE}/warehouses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    throw error;
  }
}

export async function addWarehouse(warehouseData: any) {
  try {
    const response = await axios.post(`${API_BASE}/warehouses`, warehouseData);
    return response.data;
  } catch (error) {
    console.error('Error adding warehouse:', error);
    throw error;
  }
}

export async function updateWarehouse(id: string, warehouseData: any) {
  try {
    const response = await axios.put(`${API_BASE}/warehouses/${id}`, warehouseData);
    return response.data;
  } catch (error) {
    console.error('Error updating warehouse:', error);
    throw error;
  }
}

// --- Transaction APIs ---
export async function getTransactions() {
  try {
    const response = await axios.get(`${API_BASE}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function addTransaction(transactionData: any) {
  try {
    const response = await axios.post(`${API_BASE}/transactions`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

// Dashboard Operations
export const getDashboardData = async (startDate: string, endDate: string) => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Export functions
export const exportTable = (tableId: string, format: string, data: any[]) => {
  try {
    if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${tableId}_export.csv`);
    } else if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${tableId}_export.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      
      // @ts-ignore
      doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(item => Object.values(item)),
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [63, 81, 181] },
      });
      
      doc.save(`${tableId}_export.pdf`);
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Export Successful',
      text: `The data has been exported to ${format.toUpperCase()} format.`,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error('Export error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Export Failed',
      text: `Failed to export data: ${error.message}`,
    });
  }
};