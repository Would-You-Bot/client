import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'wwyd',
  description: 'What would you do',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const { WhatYouDo } = require(`../data/wwyd-${guildDb.language}.json`);
    const randomNever = Math.floor(Math.random() * WhatYouDo.length);
    const wwydstring = WhatYouDo[randomNever];

    const wwydembed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`,
        iconURL: interaction.user?.avatarURL() || undefined,
      })
      .setDescription(wwydstring);

    const row = new ActionRowBuilder<ButtonBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(5)
          .setEmoji(config.emojis.logo.id)
          .setURL(config.links.invite),
      ]);
    }
    row.addComponents([
      new ButtonBuilder()
        .setLabel('New Question')
        .setStyle(1)
        .setEmoji(config.emojis.replay.id)
        .setCustomId(`wwyd`),
    ]);

    return interaction
      .reply({
        embeds: [wwydembed],
        components: [row],
      })
      .catch((err) => console.log(err));
  },
};

export default button;
