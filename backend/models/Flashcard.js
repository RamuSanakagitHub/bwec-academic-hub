const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  topic: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);
