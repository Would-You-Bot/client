import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/GuildProfile.model';
import { CoreSlashCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreSlashCommand = {
  data: new SlashCommandBuilder()
    .setName('wouldyourather')
    .setDescription('Get a would you rather question.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Erhalte eine Würdest du eher Frage.',
      'es-ES': 'Obtiene une pregunta ¿Qué prefieres?',
    }),
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    if (!interaction.guildId) return;

    const { General } = (await import(`../../constants/rather-${guildDb.language}.json`)).default;

    const randomrather = Math.floor(Math.random() * General.length);

    const ratherEmbed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomrather}`,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setDescription(General[randomrather]);

    const mainRow = new ActionRowBuilder<ButtonBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.emojis.logo.id)
          .setURL(config.links.invite),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel('New Question')
        .setStyle(ButtonStyle.Primary)
        .setEmoji(config.emojis.replay.id)
        .setCustomId(`wouldyourather`)
        .setDisabled(!guildDb.replay),
    ]);

    const time = 60_000;
    const threeMinutes = 3 * 60 * 1e3;

    const vote = await client.voting.generateVoting(
      interaction.guildId,
      interaction.channelId,
      time < threeMinutes ? 0 : Math.floor((Date.now() + time) / 1000),
      0
    );

    if (!vote) return;

    await interaction
      .reply({
        embeds: [ratherEmbed],
        components: [vote.row, mainRow],
        fetchReply: true,
      })
      .catch(client.logger.error);
  },
};

export default command;
