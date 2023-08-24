const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    required: true,
    default: 'male',
  },
  phone: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  address: { type: String, default: '' },
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
});

module.exports = Customer = mongoose.model('Customer', CustomerSchema);
