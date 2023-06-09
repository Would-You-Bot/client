import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { version } from 'package.json';

import config from '@config';
import { CoreCommandOptions } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommandOptions = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows information about the bot.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Zeigt einige Informationen über den Bot.',
      'es-ES': 'Muestra información sobre el bot.',
    }),
  /**
   * @param interaction
   * @param client
   */
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    if (!client.uptime) return;

    const unixstamp = Math.floor(Date.now() / 1000 || 0) - Math.floor(client.uptime / 1000);

    /**
     * @param num
     */
    function round(num: number) {
      const m = Number((Math.abs(num) * 100).toPrecision(15));
      return (Math.round(m) / 100) * Math.sign(num);
    }

    const developers = config.developers.map((id) => {
      const devUser = client.users.cache.get(id);
      if (!devUser) return;
      return devUser.tag;
    });

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
          value: `\`\`\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\`\`\``,
          inline: true,
        },
        {
          name: 'Memory 🎇',
          value: `\`\`\`${round(process.memoryUsage().heapUsed / 1000000000)}GB\n\`\`\``,
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
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .setFooter({
        text: `${interaction.user.tag} Shard #${interaction.guild?.shardId ?? 0}`,
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setTimestamp();

    interaction.reply({ embeds: [infoEmbed], ephemeral: false }).catch(client.logger.error);
  },
};

export default command;
