const { WebhookClient } = require('discord.js');
require('dotenv').config();

module.exports = async (client, guild) => {
  const webhookClient = new WebhookClient({ url: process.env.WEBHOOK });

  webhookClient.send({
    content: `<:GoodCheck:1025490645525209148> Joined ${guild.name}. I'm now in ${client.guilds.cache.size} guilds.`,
    username: `${guild.name.replace("Discord", "").replace("discord", "")}`,
    avatarURL: guild.iconURL({ format: 'webp', dynamic: true, size: 1024 }),
  }).catch((err) => console.log(err));
};
