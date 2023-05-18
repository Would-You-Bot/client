import { CoreCron } from '@typings/core';
import { ExtendedClient } from 'src/client';

const cron: CoreCron = {
  id: 'dailyMessage',
  name: 'Daily Message',
  interval: '0 0 * * *',
  /**
   * The function to execute.
   * @param client The extended client.
   * @returns The result of the execution.
   */
  execute: async (...params) => {
    const client = params[0] as ExtendedClient;

    return undefined;
  },
};

export default cron;
