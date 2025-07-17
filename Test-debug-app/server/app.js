const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const bugRoutes = require('./routes/bugRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/bugs', bugRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;