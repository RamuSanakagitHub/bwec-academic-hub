const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.unit) filter.unit = req.query.unit;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    const cards = await Flashcard.find(filter).populate('subject', 'code name');
    res.json(cards);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
