import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  contactPersonName: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  addressLine3: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pinCode: {
    type: String,
    required: [true, 'PIN code is required'],
    trim: true
  },
  gstNo: {
    type: String,
    required: [true, 'GST number is required'],
    trim: true,
    unique: true
  },
  emailId: {
    type: String,
    required: [true, 'Email ID is required'],
    trim: true,
    unique: true,
    lowercase: true
  },
  whatsappNo: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  addedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Supplier', supplierSchema);