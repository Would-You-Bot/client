import { verifyEnvironment } from '@slekup/utils';
import dotenv from 'dotenv';

dotenv.config();

const newEnv = verifyEnvironment([
  'NODE_ENV',
  'DEBUG',

  'MONGODB_URI',
  'SECRET_KEY',
  'SECRET_IV',
  'ENCRYPTION_METHOD',

  'BOT_TOKEN_DEV',
  'BOT_TOKEN_BETA',
  'BOT_TOKEN_PROD',

  'TOPGG_TOKEN',

  'DEV_GUILD',
  'DEV_ROLE',

  'PUBLIC_VOTE_CHANNEL',
  'PUBLIC_GUILD_CHANNEL',

  'PREMIUM_CHANNEL',
  'GUILD_CHANNEL',
  'ALERTS_CHANNEL',
  'INFO_CHANNEL',
  'WARN_CHANNEL',
  'ERROR_CHANNEL',
  'DEBUG_CHANNEL',
]);

export default newEnv;
