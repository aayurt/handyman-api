const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
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

module.exports = Applicant = mongoose.model('Applicant', ApplicantSchema);
