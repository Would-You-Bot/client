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
  name: 'wouldyourather',
  description: 'would you rather',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const { General } =
      await require(`../data/rather-${guildDb.language}.json`);
    if (!guildDb.replay)
      return interaction.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          'Rather.replays.disabled'
        ),
      });

    const mainRow = new ActionRowBuilder<ButtonBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(5)
          .setEmoji(config.emojis.logo.id)
          .setURL(config.links.invite),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel('New Question')
        .setStyle(1)
        .setEmoji(config.emojis.replay.id)
        .setCustomId(`wouldyourather`)
        .setDisabled(!guildDb.replay),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const randomrather = Math.floor(Math.random() * General.length);
    const vote = await client.voting.generateVoting(
      interaction.guildId,
      interaction.channelId,
      time < three_minutes ? 0 : ~~((Date.now() + time) / 1000),
      0
    );

    if (!vote)
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          'Rather.voting.error'
        ),
        ephemeral: true,
      });

    let ratherembed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomrather}`,
        iconURL: interaction.user?.avatarURL() || undefined,
      })
      .setDescription(General[randomrather]);

    return interaction
      .reply({
        embeds: [ratherembed],
        components: [vote.row, mainRow],
      })
      .catch((err) => console.log(err));
  },
};

export default button;
