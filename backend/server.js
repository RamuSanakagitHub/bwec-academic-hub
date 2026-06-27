const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/units', require('./routes/units'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/attendance', require('./routes/attendance'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bwec_academic_hub')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
