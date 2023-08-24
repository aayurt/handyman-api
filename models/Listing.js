const mongoose = require('mongoose');
const Category = require('./Category');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: { type: String, required: true },
  thumbnailImage: {
    type: String,
    default: '/uploads/profile/test.png',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: Category,
    required: true,
  },
  numApps: { type: Number, required: true, default: 0 },
  numAccepted: { type: Number, required: true, default: 0 },
  postingDate: { type: Date, required: true, default: Date.now },
  deadlineDate: { type: Date, required: true },
  duration: { type: Number, required: true, default: 0, min: 0, max: 6 },
  payRate: { type: Number, required: true },
  numRatings: { type: Number, required: true, default: 0 },
  ratingSum: { type: Number, required: true, default: 0 },
  contractor: {
    id: { type: Schema.Types.ObjectId, ref: 'Contractor', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  deleted: { type: Boolean, default: false },
});

module.exports = Listing = mongoose.model('Listing', ListingSchema);
