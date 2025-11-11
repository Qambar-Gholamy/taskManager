const express = require('express');
// const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const app = express();

app.use(express.json());
// /* ---------------------- 1) RATE LIMITING (before routes) --------------------- */
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests, please try again after an hour',
// });
// app.use('/taskManager', limiter);

// /* ---------------------- 2) BODY PARSER (after security) ---------------------- */
// app.use(express.json({ limit: '100kb' }));

/* ------------------------------- 3) ROUTES ---------------------------------- */
app.use('/', (req, res) => {
  res.json('runing the app is here');
});
app.use('/taskManager/users', userRoutes);
app.use('/taskManager/reports', reportRoutes);
/* --------------------------- 4) 404 HANDLER --------------------------------- */
app.all(/.*/, (req, res, next) => {
  const message = 'Resource not found!';
  console.log(message);
  next();
});

module.exports = app;
