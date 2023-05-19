import { CoreCron } from '@typings/core';
import { ExtendedClient } from 'src/client';

const cron: CoreCron = {
  id: 'dailyMessage',
  name: 'Daily Message',
  interval: '0 0 * * *',
  /**
   * The function to execute.
   * @param args The extended client.
   * @returns The result of the execution.
   */
  execute: async (...args) => {
    const client = args[0] as ExtendedClient;

    /* 
    TODO:
    - loop through every guild with daily messages enabled
    - get the channel (delete if doesn't exist)
    - get a random question
    - send the question to the channel
    */

    return undefined;
  },
};

export default cron;
