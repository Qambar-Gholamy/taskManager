const User = require('../models/userModel');

const trainers = [
  {
    name: 'Sayeed Mahdi',
    email: 'sayeedmahdimousavi789@example.com',
    password: 'password123',
    role: 'trainer',
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    password: 'password123',
    role: 'trainer',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    password: 'password123',
    role: 'trainer',
  },
];

const insertTrainers = async function () {
  return await User.insertMany(trainers)
    .then(() => {
      console.log('Trainers data inserted successfully!');
    })
    .catch((error) => {
      console.error('Error inserting trainers data:', error);
    });
};

module.exports = insertTrainers;
