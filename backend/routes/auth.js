const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'bwec_secret', { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch, year, rollNumber } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, branch, year, semester: year * 2, rollNumber });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, branch: user.branch, year: user.year, semester: user.semester, streakCount: user.streakCount, xp: user.xp, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const now = new Date();
    const last = user.lastActive ? new Date(user.lastActive) : null;
    if (last) {
      const diff = Math.floor((now - last) / 86400000);
      if (diff === 1) user.streakCount += 1;
      else if (diff > 1) user.streakCount = 1;
    } else { user.streakCount = 1; }
    user.lastActive = now;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, branch: user.branch, year: user.year, semester: user.semester, streakCount: user.streakCount, xp: user.xp, token: genToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/profile', async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'bwec_secret');
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch { res.status(401).json({ message: 'Invalid token' }); }
});

module.exports = router;
