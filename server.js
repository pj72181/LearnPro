const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file)));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(data, null, 2));
}

app.get('/api/quizzes', (req, res) => {
  const quizzes = readJson('quizzes.json');
  res.json(quizzes);
});

app.post('/api/submit', (req, res) => {
  const { userId, answers } = req.body;
  const quizzes = readJson('quizzes.json');
  let score = 0;
  quizzes.questions.forEach((q, idx) => {
    if (q.correct === answers[idx]) score++;
  });
  const leaderboard = readJson('leaderboard.json');
  leaderboard.push({ id: uuidv4(), userId, score, date: new Date().toISOString() });
  writeJson('leaderboard.json', leaderboard);
  res.json({ score });
});

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = readJson('leaderboard.json');
  res.json(leaderboard);
});

app.get('/api/user/:id', (req, res) => {
  const users = readJson('users.json');
  const user = users.find(u => u.id === req.params.id);
  if (user) res.json(user); else res.status(404).json({ error: 'User not found' });
});

app.put('/api/user/:id', (req, res) => {
  const users = readJson('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...req.body };
    writeJson('users.json', users);
    res.json(users[idx]);
  } else res.status(404).json({ error: 'User not found' });
});

app.get('/api/badges', (req, res) => {
  res.json(readJson('badges.json'));
});

app.post('/api/feedback', (req, res) => {
  const feedbacks = readJson('feedback.json');
  feedbacks.push({ id: uuidv4(), ...req.body, date: new Date().toISOString() });
  writeJson('feedback.json', feedbacks);
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
