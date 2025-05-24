import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, 'Warehouse name is required'],
    trim: true,
    unique: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  managerName: {
    type: String,
    required: [true, 'Manager name is required'],
    trim: true
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Warehouse', warehouseSchema);