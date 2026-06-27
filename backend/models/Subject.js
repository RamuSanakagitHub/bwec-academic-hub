const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, enum: ['ECE', 'CSE', 'AIML', 'COMMON'], required: true },
  year: { type: Number, min: 1, max: 4, required: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  credits: { type: Number, default: 4 },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
