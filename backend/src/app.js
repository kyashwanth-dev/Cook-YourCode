const cors = require('cors');
const express = require('express');

const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

app.use((error, _req, res, _next) => {
  const statusCode = error.name === 'CastError' ? 400 : 500;
  res.status(statusCode).json({ message: error.message || 'Unexpected server error' });
});

module.exports = app;
