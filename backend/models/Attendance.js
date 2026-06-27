const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  present: { type: Boolean, default: false }
});

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  strikes: { type: Number, default: 0 },
  warning: { type: Boolean, default: false },
  records: [recordSchema]
}, { timestamps: true });

attendanceSchema.pre('save', function (next) {
  if (this.totalClasses > 0) {
    this.percentage = Math.round((this.attendedClasses / this.totalClasses) * 100);
    this.warning = this.percentage < 75;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
