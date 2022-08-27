const guildcreate = require('../util/Models/guildModel');

module.exports = (client, interaction) => {
  if (!interaction.guild) {
    interaction.reply({
      content: 'You need to be in a server to use this command.',
      ephemeral: true,
    });
  } else {
    guildcreate
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        if (!result) {
          await guildcreate.create({
            guildID: interaction.guild.id,
            language: 'en_EN',
            botJoined: Date.now() / 1000 | 0,
          });
        } else {
        }
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
          command.execute(interaction, client);
        } catch (err) {
          if (err) console.error(err);
          interaction.reply({
            content: 'An error occurred while trying to execute that command.',
            ephemeral: true,
          });
        }
      });
  }
};
