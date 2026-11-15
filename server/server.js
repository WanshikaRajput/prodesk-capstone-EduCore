const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => res.send('EduCore API is running'));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/courses', authMiddleware, require('./routes/courses'));
app.use('/api/ai', authMiddleware, require('./routes/ai'));
// 404: route nahi mila
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler: server crash nahi hoga
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }
  res.status(500).json({ success: false, message: 'Internal server error' });
});
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  })
  .catch((err) => console.log('DB error:', err.message));