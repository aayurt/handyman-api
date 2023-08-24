const mongoose = require('mongoose');
const Listing = require('./Listing');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: String,
  image: String,

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

module.exports = Category = mongoose.model('Category', CategorySchema);
