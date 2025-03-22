const express = require('express');
const stockRoutes = require('./routes/stocksDaily.routes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/stocks', stockRoutes);



// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
