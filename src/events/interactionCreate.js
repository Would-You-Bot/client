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
        } 
        const { inter } = require(`../languages/${result.language}.json`);
        if (interaction.isChatInputCommand()) {
          const command = client.commands.get(interaction.commandName);
          if (!command) return;
          try {
            command.execute(interaction, client);
          } catch (err) {
            if (err) console.error(err);
            interaction.reply({
              content: inter.error,
              ephemeral: true,
            });
          }
        } else if (interaction.isButton()) {
          if (client.used.has(interaction.user.id)) return await interaction.reply({ ephemeral: true, content: inter.wait }).catch(() => { });
          const button = client.buttons.get(interaction.customId);
          if (!button) return interaction.reply({ content: inter.again, ephemeral: true }).catch(() => {  });
          try {
            client.used.set(interaction.user.id, Date.now() + 30000)
            setTimeout(() => client.used.delete(interaction.user.id), 30000)

            button.execute(interaction, client);
          } catch (err) {
            if (err) console.error(err);
            interaction.reply({
              content: inter.error,
              ephemeral: true,
            });
          }
        }
      });
  }
};
