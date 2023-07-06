import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { version } from 'package.json';

import config from '@config';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows information about the bot.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Zeigt einige Informationen über den Bot.',
      'es-ES': 'Muestra información sobre el bot.',
    }),
}).execute((client, interaction) => {
  if (!client.uptime) return;

  const unixstamp =
    Math.floor(Date.now() / 1000 || 0) - Math.floor(client.uptime / 1000);

  const developers = [];

  for (const id of config.developers) {
    const devUser = client.users.cache.get(id);
    if (devUser) developers.push(devUser.username);
  }

  const infoEmbed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle('Bot Info')
    .addFields(
      {
        name: 'Developers 🐧',
        value: `
        \`\`\`${developers.map((dev) => `${dev}`).join('\n')}\`\`\``,
        inline: false,
      },
      {
        name: 'Guilds 🏢',
        value: `\`\`\`${client.guilds.cache.size}\`\`\``,
        inline: true,
      },
      {
        name: 'Users 🐧',
        value: `\`\`\`${client.guilds.cache
          .reduce(
            (accumulator, current) => accumulator + current.memberCount,
            0
          )
          .toLocaleString()}\`\`\``,
        inline: true,
      },
      {
        name: 'Memory 🎇',
        value: `\`\`\`${(process.memoryUsage().heapUsed / 1000000000).toFixed(
          2
        )}GB\n\`\`\``,
        inline: true,
      },
      {
        name: 'Last Restart 🚀',
        value: `
        <t:${unixstamp}:R>`,
        inline: true,
      },
      {
        name: 'Bot Version 🧾',
        value: `\`\`\`v${version}\`\`\``,
        inline: true,
      }
    )
    .setThumbnail(client.user?.displayAvatarURL() ?? null)
    .setFooter({
      text: `${interaction.user.username} Shard #${
        interaction.guild?.shardId ?? 0
      }`,
      iconURL: client.user?.avatarURL() ?? undefined,
    })
    .setTimestamp();

  interaction
    .reply({ embeds: [infoEmbed], ephemeral: false })
    .catch(client.logger.error);
});
