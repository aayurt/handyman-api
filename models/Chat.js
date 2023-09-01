const mongoose = require('mongoose');
const Contractor = require('./Contractor');
const Customer = require('./Customer');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  contractor: {
    type: Schema.Types.ObjectId,
    ref: Contractor,
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: Customer,
    required: true,
  },
  msg: { type: String, require: true },
});

module.exports = Chat = mongoose.model('Chat', ChatSchema);
