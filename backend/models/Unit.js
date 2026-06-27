const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  explanation: String,
  keyPoints: [String],
  formulas: [String],
  diagramType: { type: String, enum: ['waveform', 'flowchart', 'graph', 'circuit', 'block', 'none'], default: 'none' },
  diagramLabel: String
});

const unitSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unitNumber: { type: Number, required: true },
  title: { type: String, required: true },
  overview: String,
  topics: [topicSchema]
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
