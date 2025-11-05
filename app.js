const express = require('express');
const rateLimit = require('express-rate-limit');
const internRoutes = require('./routes/internRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const reportRoutes = require('./routes/reportRoutes');
const app = express();

/* ---------------------- 1) RATE LIMITING (before routes) --------------------- */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again after an hour',
});
app.use('/taskManager', limiter);

// /* ---------------------- 2) BODY PARSER (after security) ---------------------- */
// app.use(express.json({ limit: '100kb' }));

/* ------------------------ 3) STATIC FILES (public/) -------------------------- */
// app.use(express.static(`${__dirname}/public`));

/* ------------------------------- 4) ROUTES ---------------------------------- */
app.use('/taskManager/interns', internRoutes);
app.use('/taskManager/trainers', trainerRoutes);
app.use('/taskManager/reports', reportRoutes);
/* --------------------------- 5) 404 HANDLER --------------------------------- */
app.all(/.*/, (req, res, next) => {
  const message = 'Resource not found!';
  console.log(message);
  next();
});

module.exports = app;
