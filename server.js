import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import SKU from './src/models/SKU.js';
import Supplier from './src/models/Supplier.js';
import Transaction from './src/models/Transaction.js';
import Warehouse from './src/models/Warehouse.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// SKU Routes
app.get('/api/skus', async (req, res) => {
  try {
    const skus = await SKU.find();
    res.json(skus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/skus', async (req, res) => {
  try {
    const sku = new SKU(req.body);
    const newSku = await sku.save();
    res.status(201).json(newSku);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/skus/:id', async (req, res) => {
  try {
    const updatedSku = await SKU.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSku);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supplier Routes
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Warehouse Routes
app.get('/api/warehouses', async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/warehouses', async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    const newWarehouse = await warehouse.save();
    res.status(201).json(newWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/warehouses/:id', async (req, res) => {
  try {
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Transaction Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const newTransaction = await transaction.save();
    
    // Update SKU stock
    const sku = await SKU.findOne({ sku: transaction.sku });
    if (sku) {
      if (transaction.type === 'Adjusted In' || transaction.type === 'Purchase') {
        sku.currentStock += transaction.quantity;
      } else if (transaction.type === 'Adjusted Out' || transaction.type === 'Sale') {
        sku.currentStock -= transaction.quantity;
      }
      await sku.save();
    }
    
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Dashboard Data Route
app.get('/api/dashboard', async (req, res) => {
  try {
    const [totalSKUs, totalTransactions, totalSuppliers, totalWarehouses] = await Promise.all([
      SKU.countDocuments(),
      Transaction.countDocuments(),
      Supplier.countDocuments(),
      Warehouse.countDocuments()
    ]);

    const skus = await SKU.find();
    const inventoryValuation = skus.reduce((total, sku) => total + (sku.currentStock * sku.price), 0);

    const lowStock = skus.filter(sku => sku.currentStock < sku.minLvl);
    const overStock = skus.filter(sku => sku.currentStock > sku.maxLvl);

    res.json({
      totalSKUs,
      totalTransactions,
      totalSuppliers,
      totalWarehouses,
      inventoryValuation,
      lowStock,
      overStock
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});