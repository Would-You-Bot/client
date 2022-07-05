import { Client, Intents } from 'discord.js';

/* Misc */
console.clear();

/* Initialize client */
const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
});

const wouldyouComponents = async () => {
  await require('./util/wouldyouClient')(client);
  await require('./util/dbHandler.ts');
}

wouldyouComponents();