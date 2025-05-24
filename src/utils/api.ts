import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const API_BASE = '/api';

// --- SKU APIs ---
export async function getSKUs() {
  const res = await fetch(`${API_BASE}/skus`);
  if (!res.ok) throw new Error('Failed to fetch SKUs');
  return res.json();
}

export async function addSKU(skuData: any) {
  const res = await fetch(`${API_BASE}/skus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skuData),
  });
  if (!res.ok) throw new Error('Failed to add SKU');
  return res.json();
}

export async function updateSKU(id: string, skuData: any) {
  const res = await fetch(`${API_BASE}/skus/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skuData),
  });
  if (!res.ok) throw new Error('Failed to update SKU');
  return res.json();
}

export async function deleteSKU(id: string) {
  const res = await fetch(`${API_BASE}/skus/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete SKU');
  return res.json();
}

// --- Supplier APIs ---
export async function getSuppliers() {
  const res = await fetch(`${API_BASE}/suppliers`);
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json();
}

export async function addSupplier(supplierData: any) {
  const res = await fetch(`${API_BASE}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplierData),
  });
  if (!res.ok) throw new Error('Failed to add supplier');
  return res.json();
}

export async function updateSupplier(id: string, supplierData: any) {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplierData),
  });
  if (!res.ok) throw new Error('Failed to update supplier');
  return res.json();
}

export async function deleteSupplier(id: string) {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete supplier');
  return res.json();
}

// --- Warehouse APIs ---
export async function getWarehouses() {
  const res = await fetch(`${API_BASE}/warehouses`);
  if (!res.ok) throw new Error('Failed to fetch warehouses');
  return res.json();
}

export async function addWarehouse(warehouseData: any) {
  const res = await fetch(`${API_BASE}/warehouses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(warehouseData),
  });
  if (!res.ok) throw new Error('Failed to add warehouse');
  return res.json();
}

export async function updateWarehouse(id: string, warehouseData: any) {
  const res = await fetch(`${API_BASE}/warehouses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(warehouseData),
  });
  if (!res.ok) throw new Error('Failed to update warehouse');
  return res.json();
}

export async function deleteWarehouse(id: string) {
  const res = await fetch(`${API_BASE}/warehouses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete warehouse');
  return res.json();
}

// --- Transaction APIs ---
export async function getTransactions() {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(transactionData: any) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  if (!res.ok) throw new Error('Failed to add transaction');
  return res.json();
}

export async function updateTransaction(id: string, transactionData: any) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  return res.json();
}

export async function deleteTransaction(id: string) {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return res.json();
}

// Dashboard Operations
export const getDashboardData = async (startDate: string, endDate: string) => {
  try {
    const [
      totalSKUs,
      totalTransactions,
      totalVendors,
      totalWarehouses,
      transactions,
      skus
    ] = await Promise.all([
      SKU.countDocuments(),
      Transaction.countDocuments(),
      Supplier.countDocuments(),
      Warehouse.countDocuments(),
      Transaction.find({
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }),
      SKU.find()
    ]);

    // Calculate inventory valuation
    const inventoryValuation = skus.reduce((total, sku) => {
      return total + (sku.currentStock * sku.price);
    }, 0);

    // Get low stock and over stock items
    const lowStock = skus
      .filter(sku => sku.currentStock < sku.minLvl)
      .map(sku => [sku.itemName, sku.sku, sku.minLvl, sku.currentStock]);

    const overStock = skus
      .filter(sku => sku.currentStock > sku.maxLvl)
      .map(sku => [sku.itemName, sku.sku, sku.maxLvl, sku.currentStock]);

    return {
      totalSKUs,
      totalTransactions,
      totalVendors,
      totalWarehouses,
      inventoryValuation: inventoryValuation.toFixed(2),
      lowStock,
      overStock,
      // Add other dashboard calculations as needed
    };
  } catch (error) {
    return handleError(error);
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
      text: `Failed to export data: ${error.message || error}`,
    });
  }
};