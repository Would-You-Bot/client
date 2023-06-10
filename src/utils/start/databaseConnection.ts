import colors from 'colors';
import mongoose from 'mongoose';

import config from '@config';
import { logger } from '@utils/client';

mongoose.set('strictQuery', true);

/**
 * Initialize the database connection.
 * @returns The connection or an error.
 */
const connectToDatabase = async (): Promise<void> => {
  const connectionString = `${config.env.MONGODB_URI}`;
  try {
    const { connection } = await mongoose.connect(connectionString);
    logger.info(
      colors.green(`Successfully connected to the database: ${connection.name}`)
    );
  } catch (error) {
    logger.error(error);
    logger.error(
      colors.red(
        `Failed to connect to database(${connectionString}), exiting process...`
      )
    );
    process.exit(0);
  }
};

export default connectToDatabase;
