import mongoose from 'mongoose';

const skuSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU code is required'],
    unique: true,
    trim: true
  },
  uom: {
    type: String,
    required: [true, 'Unit of measure is required'],
    trim: true
  },
  minLvl: {
    type: Number,
    required: [true, 'Minimum level is required'],
    min: 0
  },
  maxLvl: {
    type: Number,
    required: [true, 'Maximum level is required'],
    min: 0
  },
  reorderQty: {
    type: Number,
    required: [true, 'Reorder quantity is required'],
    min: 0
  },
  warehouse: {
    type: String,
    required: [true, 'Warehouse is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  openingStock: {
    type: Number,
    required: [true, 'Opening stock is required'],
    min: 0
  },
  currentStock: {
    type: Number,
    default: function() {
      return this.openingStock;
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  vendor1: String,
  vendor2: String,
  vendor3: String,
  vendor4: String,
  vendor5: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('SKU', skuSchema);