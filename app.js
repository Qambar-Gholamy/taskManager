const express = require('express');
// const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/imgs')));

const cors = require('cors');
app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  }),
);

app.use('/taskManager/users', userRoutes);
app.use('/taskManager/reports', reportRoutes);

app.all(/.*/, (req, res, next) => {
  const message = 'Resource not found!';
  console.log(message);
  next();
});

module.exports = app;
