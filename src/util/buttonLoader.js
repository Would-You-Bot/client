const { readdirSync } = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const { ChalkAdvanced } = require('chalk-advanced');

module.exports = async (client) => {
  /* It's creating a new collection for the buttons and adding them to it. */
  client.buttons = new Collection();
  for (const file of readdirSync(path.join(__dirname, '..', 'buttons')).filter((file) => file.endsWith('.js'))) {
    const button = require(`../buttons/${file}`);
    client.buttons.set(button.data.name, button);
  }
  console.log(`${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray('>')} ${ChalkAdvanced.green('Successfully loaded buttons')}`);
};
