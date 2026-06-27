const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, enum: ['ECE', 'CSE', 'AIML'], required: true },
  year: { type: Number, min: 1, max: 4, required: true },
  semester: { type: Number, min: 1, max: 8 },
  rollNumber: String,
  streakCount: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  quizScores: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    total: Number,
    accuracy: Number,
    timeTaken: Number,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
