const { connect } = require('mongoose');
require('dotenv').config();

const { ChalkAdvanced } = require('chalk-advanced');


connect(process.env.MONGO_URI, {	connect(process.env.MONGO_URI, {
  useNewUrlParser: true,	  useNewUrlParser: true,
  serverSelectionTimeoutMS: 1000	}).catch((err) => { console.log(err) }).then(() => console.log(
}).then(() => console.log(	
  `${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray(	  `${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray(
    '>',	    '>',
  )} ${ChalkAdvanced.green('Successfully loaded database')}`,	  )} ${ChalkAdvanced.green('Successfully loaded database')}`,
