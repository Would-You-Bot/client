const { WebhookClient } = require('discord.js');
require('dotenv').config();

module.exports = async (client, guild) => {
  // Create and save the settings in the cache so that we don't need to do that at a command run
  await client.database.getGuild(guild?.id, true);

  const webhookClient = new WebhookClient({ url: process.env.WEBHOOK });

  webhookClient.send({
    content: `<:GoodCheck:1025490645525209148> Joined ${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}. I'm now in ${client.guilds.cache.size} guilds.`,
    username: `${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}`,
    avatarURL: guild.iconURL({ format: 'webp', dynamic: true, size: 1024 }),
  }).catch((err) => console.log(err));
};
