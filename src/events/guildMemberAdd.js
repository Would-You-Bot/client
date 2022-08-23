const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
const guildProfile = require('../util/Models/guildModel');

module.exports = async (client, member) => {
  await guildProfile.findOne({ guildID: member.guild.id, welcome: true }).then(async (result) => {
    if (!result) {
      return;
    }
    console.log(result.welcomeChannel);
  });
};
