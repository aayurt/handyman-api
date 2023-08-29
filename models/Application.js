const mongoose = require('mongoose');
const Customer = require('./Customer');
const Listing = require('./Listing');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: Listing, required: true },
  customer: {
    type: Schema.Types.ObjectId,
    ref: Customer,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending',
  },
  appDate: { type: Date, required: true, default: Date.now },
  closeDate: {
    type: Date,
    default: () => Date.now() + 2 * 365 * 24 * 3600 * 1000,
  },
  selectedTimeSlots: {
    type: Map,
    of: [{ type: String }],
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'esewa', 'paypal', 'stripe'],
    default: 'cod',
  },
  amount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'failed'],
    default: 'unpaid',
  },
  paidAt: Date,
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);
