const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(morgan('dev')); // HTTP request logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/users', require('./routes/users'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/permissions', require('./routes/permissions'));

module.exports = app;
