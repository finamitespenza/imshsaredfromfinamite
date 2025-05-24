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

// MongoDB Connection with proper error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

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
    if (!updatedSku) {
      return res.status(404).json({ message: 'SKU not found' });
    }
    res.json(updatedSku);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/skus/:id', async (req, res) => {
  try {
    const deletedSku = await SKU.findByIdAndDelete(req.params.id);
    if (!deletedSku) {
      return res.status(404).json({ message: 'SKU not found' });
    }
    res.json({ message: 'SKU deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    if (!updatedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    if (!updatedWarehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/warehouses/:id', async (req, res) => {
  try {
    const deletedWarehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!deletedWarehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = new Transaction(req.body);
    await transaction.save({ session });
    
    // Update SKU stock
    const sku = await SKU.findOne({ sku: transaction.sku }).session(session);
    if (!sku) {
      throw new Error('SKU not found');
    }

    if (transaction.type === 'Adjusted In' || transaction.type === 'Purchase') {
      sku.currentStock += transaction.quantity;
    } else if (transaction.type === 'Adjusted Out' || transaction.type === 'Sale') {
      if (sku.currentStock < transaction.quantity) {
        throw new Error('Insufficient stock');
      }
      sku.currentStock -= transaction.quantity;
    }
    
    await sku.save({ session });
    await session.commitTransaction();
    
    res.status(201).json(transaction);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
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

    // Get transaction statistics
    const transactionsByType = await Transaction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get inventory by warehouse
    const inventoryByWarehouse = await SKU.aggregate([
      { $group: { _id: '$warehouse', totalStock: { $sum: '$currentStock' } } }
    ]);

    // Get inventory growth over time
    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
    
    const inventoryGrowth = await Transaction.aggregate([
      { $match: { timestamp: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' }
          },
          netChange: {
            $sum: {
              $cond: [
                { $in: ['$type', ['Adjusted In', 'Purchase']] },
                '$quantity',
                { $multiply: ['$quantity', -1] }
              ]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalSKUs,
      totalTransactions,
      totalSuppliers,
      totalWarehouses,
      inventoryValuation,
      lowStock,
      overStock,
      transactionsByType,
      inventoryByWarehouse,
      inventoryGrowth
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});