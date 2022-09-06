const { Collection } = require('discord.js');

require('dotenv').config();

module.exports = (client) => {
  /* Basically loading the event loader ironic right */
  require('./eventLoader')(client);

  /* It's creating a new collection for the commands. */
  client.commands = new Collection();

  /* It's creating a new collection for the buttons and adding them to it. */
  require('./buttonLoader')(client);

  /* Logging the bot in. */
  client.login(process.env.TOKEN);
};
