const { Client, GatewayIntentBits } = require('discord.js');

/* Misc */
console.clear();

/* Initialize client */
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
    ],
});

const wouldyouComponents = async () => {
  await require('./util/wouldyouClient')(client);
  await require('./util/dbHandler');
}

wouldyouComponents();