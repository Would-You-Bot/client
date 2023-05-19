import { GuildProfileModel } from '@models/GuildProfile.model';

/* 
- Remove a guilds data from database and cache if the bot has not been in the server for more than 30 days
  - webhooks
  - guildProfiles
  - question packs (save backup first)
*/

import { CoreCron } from '@typings/core';
import { ExtendedClient } from 'src/client';

const cron: CoreCron<ExtendedClient> = {
  id: 'cleanCron',
  name: 'Clean Cron',
  expression: '0 * * * *',
  timezone: 'America/New_York',
  /**
   * The function to execute.
   * @param client The extended client.
   * @returns Nothing.
   */
  execute: async (client: ExtendedClient) => {
    const allGuildProfiles = await GuildProfileModel.find();
    return undefined;
  },
};

export default cron;
