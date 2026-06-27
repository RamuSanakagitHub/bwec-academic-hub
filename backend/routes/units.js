const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;
    const units = await Unit.find(filter).populate('subject', 'code name').sort({ unitNumber: 1 });
    res.json(units);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).populate('subject', 'code name branch year semester');
    if (!unit) return res.status(404).json({ message: 'Not found' });
    res.json(unit);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
