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
    enum: ['pending', 'processing', 'ordered', 'cancelled'],
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
});

module.exports = Application = mongoose.model('Application', ApplicationSchema);
