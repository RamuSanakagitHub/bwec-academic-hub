const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.unit) filter.unit = req.query.unit;
    if (req.query.type) filter.type = req.query.type;
    const quizzes = await Quiz.find(filter).populate('subject', 'code name').select('-questions.correctAnswer -questions.explanation');
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('subject', 'code name');
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    let score = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) score++;
      return { question: q.question, selected: answers[i], correct: q.correctAnswer, isCorrect, explanation: q.explanation };
    });
    const accuracy = Math.round((score / quiz.questions.length) * 100);
    const user = await User.findById(req.user._id);
    user.xp += score * 10;
    user.quizScores.push({ quiz: quiz._id, score, total: quiz.questions.length, accuracy, timeTaken: timeTaken || 0 });
    await user.save();
    res.json({ score, total: quiz.questions.length, accuracy, timeTaken, results });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
