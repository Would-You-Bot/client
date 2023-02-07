const { WebhookClient, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = async (client, guild) => {
  if(!guild?.name) return;

  // Only delete the guild settings from the cache we don't want a data lose but also don't need not used data in the cache :)
  await client.database.deleteGuild(guild?.id, true);

  const webhookClient = new WebhookClient({ url: process.env.WEBHOOK });
  const webhookPrivate = new WebhookClient({ url: process.env.WEBHOOKPRIVATE });

  let features;
  if (guild.features && guild.features.includes("VERIFIED") || guild.features.includes("PARTNERED")) {
    features = guild.features.includes("VERIFIED") ? `<:verified_green:1072265950134550548>` : `<:partner:1072265822577360982>`;
  };

  webhookPrivate.send({
    embeds: [new EmbedBuilder().setTitle(`← Left Server`).setColor(`#0598F4`).setThumbnail(guild.iconURL({ format: 'png', dynamic: true })).setDescription(`**Name**: ${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}\n**Users**: ${guild.memberCount.toLocaleString()}${features ? `\n**Features**: ${features}` : ``}`)]
  });

  webhookClient.send({
    content: `<:BadCheck:1025490660968628436> Left ${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}. I'm now in ${client.guilds.cache.size} guilds.`,
    username: `${guild.name.replace("Discord", "").replace("discord", "").replace("Everyone", "").replace("everyone", "")}`,
    avatarURL: guild.iconURL({ format: 'webp', dynamic: true, size: 1024 }),
  }).catch((err) => console.log(err));
};
