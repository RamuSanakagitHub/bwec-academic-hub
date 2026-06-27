const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const data = await Attendance.find({ student: req.user._id }).populate('subject', 'code name');
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/mark', protect, async (req, res) => {
  try {
    const { subjectId, date, present } = req.body;
    let att = await Attendance.findOne({ student: req.user._id, subject: subjectId });
    if (!att) att = new Attendance({ student: req.user._id, subject: subjectId });
    att.records.push({ date: new Date(date), present });
    att.totalClasses += 1;
    if (present) att.attendedClasses += 1;
    else att.strikes += 1;
    await att.save();
    res.json(att);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/init', protect, async (req, res) => {
  try {
    const { subjectId, totalClasses, attendedClasses } = req.body;
    let att = await Attendance.findOne({ student: req.user._id, subject: subjectId });
    if (!att) att = new Attendance({ student: req.user._id, subject: subjectId });
    att.totalClasses = totalClasses;
    att.attendedClasses = attendedClasses;
    await att.save();
    res.json(att);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
