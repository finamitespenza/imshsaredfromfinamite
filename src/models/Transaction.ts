import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
    ref: 'SKU'
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['Adjusted In', 'Adjusted Out', 'Purchase', 'Sale']
  },
  remarks: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);