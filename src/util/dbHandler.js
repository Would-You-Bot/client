const { connect } = require('mongoose');
require('dotenv').config();

const { ChalkAdvanced } = require('chalk-advanced');

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
}).catch((err) => { console.log(err) }).then(() => console.log(
  `${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray(
    '>',
  )} ${ChalkAdvanced.green('Successfully loaded database')}`,
));
