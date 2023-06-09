import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/GuildProfile.model';
import { ICoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: ICoreButton = {
  name: 'wwyd',
  description: 'What would you do',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    const { WhatYouDo } = (await import(`../../constants/wwyd-${guildDb.language}.json`)).default;

    const randomNever = Math.floor(Math.random() * WhatYouDo.length);
    const wwydstring = WhatYouDo[randomNever];

    const wwydembed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setDescription(wwydstring);

    const row = new ActionRowBuilder<ButtonBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.emojis.logo.id)
          .setURL(config.links.invite),
      ]);
    }
    row.addComponents([
      new ButtonBuilder()
        .setLabel('New Question')
        .setStyle(ButtonStyle.Primary)
        .setEmoji(config.emojis.replay.id)
        .setCustomId(`wwyd`),
    ]);

    return interaction
      .reply({
        embeds: [wwydembed],
        components: [row],
      })
      .catch(client.logger.error);
  },
};

export default button;
