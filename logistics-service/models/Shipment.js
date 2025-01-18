const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  sender: {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  receiver: {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  details: {
    description: { type: String, required: true },
    weight: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  trackingNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
