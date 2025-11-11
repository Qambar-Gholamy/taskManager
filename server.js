const dotenv = require('dotenv').config({ path: './config.env' });
const User = require('./models/userModel.js');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error('💥 UNHANDLED EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.log(err);
  process.exit(1);
});

const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
mongoose.connect(DB).then(() => {
  console.log('success!');
});

// const insertTrainers = async function () {
//   const findTrainers = await User.find({ role: 'trainer' }).exec();
//   console.log('findtrainer', findTrainers);

//   if (findTrainers.length === 0) {
//     const insertTrainers = require('./seeder.js');
//     insertTrainers();
//   }
// };

// insertTrainers();

////// start the server
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${port} ...`);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');

  console.error(err.name, err.message);

  process.exit(1);
});
