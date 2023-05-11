import * as tsConfigPaths from 'tsconfig-paths';
import * as tsConfig from '../tsconfig.json';

const baseUrl = './';
const cleaup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

import * as dotenv from 'dotenv';
dotenv.config();

import { ExtendedClient } from './client';

export const client = new ExtendedClient();

(async () => {
  client.logger.info('Starting client');
  client.logger.debug('Debug Enabled');

  const app = (await import('./app.ts')).default;
  app(client);
})();
