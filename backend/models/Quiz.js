const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: Number, required: true },
  explanation: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  topic: String
});

const quizSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  type: { type: String, enum: ['quiz', 'mock', 'diagnostic'], default: 'quiz' },
  duration: { type: Number, default: 30 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
