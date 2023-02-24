const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('emit')
    .setDescription('Emits the welcome event')
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {

    client.emit("guildMemberAdd", interaction)


    interaction
      .reply({ content: "emitting welcome event", ephemeral: false })
      .catch((err) => {
        console.log(err)
      });
  },
};
