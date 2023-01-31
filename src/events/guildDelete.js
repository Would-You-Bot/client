const { WebhookClient } = require('discord.js');
require('dotenv').config();

module.exports = async (client, guild) => {
  if(!guild?.name) return;

  // Only delete the guild settings from the cache we don't want a data lose but also don't need not used data in the cache :)
  await client.database.deleteGuild(guild?.id, true);

  const webhookClient = new WebhookClient({ url: process.env.WEBHOOK });

  webhookClient.send({
    content: `<:BadCheck:1025490660968628436> Left ${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}. I'm now in ${client.guilds.cache.size} guilds.`,
    username: `${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}`,
    avatarURL: guild.iconURL({ format: 'webp', dynamic: true, size: 1024 }),
  }).catch((err) => console.log(err));
};
