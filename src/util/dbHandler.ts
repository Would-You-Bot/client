import { connect } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const { ChalkAdvanced } = require('chalk-advanced');

connect(process.env.MONGO_URI || '', {
  keepAlive: true,
}).then(() => console.log(`${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray('>')} ${ChalkAdvanced.green('Successfully loaded database')}`));

