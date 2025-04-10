const express = require('express');
const stockDailyRoutes = require('./routes/stocksDaily.routes');
const stockWeeklyRoutes = require('./routes/stocksWeekly.routes');
const yahooRoutes = require('./routes/yahooRoutes')

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/stocks', stockDailyRoutes);
app.use('/api/stocks', stockWeeklyRoutes);
app.use('/api/yahoo', yahooRoutes);


// Default Route
app.get('/', (req, res) => {
  res.send('Stocks API is running...');
});

module.exports = app;
