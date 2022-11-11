const { connect } = require('mongoose');
require('dotenv').config();

const { ChalkAdvanced } = require('chalk-advanced');

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 1000
}).then(() => console.log(
  `${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray(
    '>',
  )} ${ChalkAdvanced.green('Successfully loaded database')}`,
));
