const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("wwyd")
    .setDescription("What would you do in this situation")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Was würdest du in dieser Situation tun",
      "es-ES": "¿Qué harías en esta situación?",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    const { WhatYouDo } = require(`../data/wwyd-${guildDb.language}.json`);
    const randomNever = Math.floor(Math.random() * WhatYouDo.length)
    const wwydstring = WhatYouDo[randomNever];

    const wwydembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`,
        iconURL: interaction.user.avatarURL()
    })
      .setDescription(wwydstring);

    interaction
      .reply({ embeds: [wwydembed] })
      .catch((err) => {
        return console.log(err);
      });
  },
};
