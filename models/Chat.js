const mongoose = require('mongoose');
const Contractor = require('./Contractor');
const Customer = require('./Customer');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  contractorId: {
    type: Schema.Types.ObjectId,
    ref: Contractor,
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: Customer,
    required: true,
  },
  msg: { type: String, require: true },
});

module.exports = Chat = mongoose.model('Chat', ChatSchema);
