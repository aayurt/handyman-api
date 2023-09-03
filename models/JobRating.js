const mongoose = require('mongoose');
const Listing = require('./Listing');
const Application = require('./Application');
const Customer = require('./Customer');
const Schema = mongoose.Schema;

const JobRatingSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: Listing,
    required: true,
  },
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: Application,
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: Customer,
    required: true,
  },
  value: { type: Number, required: true, default: 0 },
  note: { type: String },
});

module.exports = JobRating = mongoose.model('JobRating', JobRatingSchema);
