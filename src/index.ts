import { Client, Intents } from 'discord.js';

/* Misc */
console.clear();

/* Initialize client */
const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.DIRECT_MESSAGES
    ],
});

const wouldyouComponents = async () => {
  await require('./util/wouldyouClient')(client);
  await require('./util/dbHandler.ts');
}

wouldyouComponents();