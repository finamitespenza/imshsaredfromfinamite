import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:5000/api';

// Generic error handler
const handleError = (error: any) => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || error.message || 'An error occurred';
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  });
  throw error;
};

// --- SKU APIs ---
export async function getSKUs() {
  try {
    const response = await axios.get(`${API_BASE}/skus`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function addSKU(skuData: any) {
  try {
    const response = await axios.post(`${API_BASE}/skus`, skuData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'SKU added successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateSKU(id: string, skuData: any) {
  try {
    const response = await axios.put(`${API_BASE}/skus/${id}`, skuData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'SKU updated successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// --- Supplier APIs ---
export async function getSuppliers() {
  try {
    const response = await axios.get(`${API_BASE}/suppliers`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function addSupplier(supplierData: any) {
  try {
    const response = await axios.post(`${API_BASE}/suppliers`, supplierData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Supplier added successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateSupplier(id: string, supplierData: any) {
  try {
    const response = await axios.put(`${API_BASE}/suppliers/${id}`, supplierData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Supplier updated successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// --- Warehouse APIs ---
export async function getWarehouses() {
  try {
    const response = await axios.get(`${API_BASE}/warehouses`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function addWarehouse(warehouseData: any) {
  try {
    const response = await axios.post(`${API_BASE}/warehouses`, warehouseData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Warehouse added successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateWarehouse(id: string, warehouseData: any) {
  try {
    const response = await axios.put(`${API_BASE}/warehouses/${id}`, warehouseData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Warehouse updated successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// --- Transaction APIs ---
export async function getTransactions() {
  try {
    const response = await axios.get(`${API_BASE}/transactions`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function addTransaction(transactionData: any) {
  try {
    const response = await axios.post(`${API_BASE}/transactions`, transactionData);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Transaction added successfully',
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// --- Dashboard APIs ---
export async function getDashboardData(startDate: string, endDate: string) {
  try {
    const response = await axios.get(`${API_BASE}/dashboard`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

// --- Utility Functions ---
export async function getUniqueSKUs() {
  try {
    const skus = await getSKUs();
    return [...new Set(skus.map((sku: any) => sku.sku))];
  } catch (error) {
    return handleError(error);
  }
}

export async function getUniqueItemNames() {
  try {
    const skus = await getSKUs();
    return [...new Set(skus.map((sku: any) => sku.itemName))];
  } catch (error) {
    return handleError(error);
  }
}

export async function getUniqueWarehouses() {
  try {
    const warehouses = await getWarehouses();
    return [...new Set(warehouses.map((warehouse: any) => warehouse.name))];
  } catch (error) {
    return handleError(error);
  }
}

export async function getManagerNames() {
  try {
    const warehouses = await getWarehouses();
    return [...new Set(warehouses.map((warehouse: any) => warehouse.managerName))];
  } catch (error) {
    return handleError(error);
  }
}

// --- Export Functions ---
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