const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContractorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  bio: { type: String, default: '' },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    required: true,
    default: 'male',
  },
  avatar: { type: String, default: '' },
  address: { type: String, default: '' },
  fcmToken: { type: String, default: '' },
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
  linkedIn: { type: String },
  github: { type: String },
  website: { type: String },

  skills: [String],
  interests: [String],
  experiences: [
    {
      employerName: { type: String, required: true },
      startYear: { type: String, required: true },
      role: String,
      endYear: String,
    },
  ],
  education: [
    {
      instituteName: { type: String, required: true },
      startYear: { type: String, required: true },
      endYear: String,
    },
  ],
  numRatings: { type: Number, required: true, default: 0 },
  ratingSum: { type: Number, required: true, default: 0 },
});

module.exports = Contractor = mongoose.model('Contractor', ContractorSchema);
