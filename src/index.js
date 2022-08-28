const { Client, GatewayIntentBits } = require('discord.js');

/* Initialize client */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const wouldyouComponents = async () => {
  await require('./util/wouldyouClient')(client);
  await require('./util/dbHandler');
  await require('./util/voteLogs');
};

wouldyouComponents();
