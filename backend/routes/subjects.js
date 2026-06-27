const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

router.get('/', async (req, res) => {
  try {
    const { branch, year, semester } = req.query;
    const filter = {};
    if (branch) filter.$or = [{ branch }, { branch: 'COMMON' }];
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = parseInt(semester);
    const subjects = await Subject.find(filter).sort({ year: 1, semester: 1, code: 1 });
    res.json(subjects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Not found' });
    res.json(subject);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
