const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobRatingSchema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  value: { type: Number, required: true, default: 0 },
});

module.exports = JobRating = mongoose.model('JobRating', JobRatingSchema);
