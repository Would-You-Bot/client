const { connect } = require('mongoose');
require('dotenv').config();

const { ChalkAdvanced } = require('chalk-advanced');

connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wouldyou', {
  useNewUrlParser: true,
}).then(() => console.log(
  `${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray(
    '>',
  )} ${ChalkAdvanced.green('Successfully loaded database')}`,
));
