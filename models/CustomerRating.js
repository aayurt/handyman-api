const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerRatingSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  contractorId: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor',
    required: true,
  },
  value: { type: Number, required: true, default: 0 },
});

module.exports = CustomerRating = mongoose.model(
  'CustomerRating',
  CustomerRatingSchema
);
