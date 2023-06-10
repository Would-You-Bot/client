import { chance } from '@slekup/utils';
import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { IExtendedClient } from '@typings/core';
import { GuildPackType } from '@typings/guild';
import { BaseQuestion, CustomQuestion, PackQuestionType } from '@typings/pack';
import CoreInterface from '@utils/builders/CoreInterface';

interface Params {
  client: IExtendedClient;
  interaction: BaseInteraction;
}

export default new CoreInterface<Params>(async ({ client, interaction }) => {
  if (!interaction.guildId) throw new Error('No guild ID');

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  let question: string;
  const questionData = client.packs.random(
    GuildPackType.Mixed,
    PackQuestionType.WouldYouRather
  );

  if (guildProfile.packType === GuildPackType.Base)
    question = (questionData as BaseQuestion).translations[
      guildProfile.language
    ];
  else if (guildProfile.packType === GuildPackType.Custom)
    question = (questionData as CustomQuestion).text;
  else if ((questionData as CustomQuestion).text) {
    question = (questionData as BaseQuestion).translations[
      guildProfile.language
    ];
  } else {
    question = (questionData as CustomQuestion).text;
  }

  const embed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setFooter({
      text: `Requested by ${interaction.user.username} | Type: Random | ID: ${questionData.id}`,
      iconURL: interaction.user.avatarURL() ?? undefined,
    })
    .setFooter({
      text: `Requested by ${interaction.user.username} | Type: General | ID: ${questionData.id}`,
      iconURL: interaction.user.avatarURL() ?? undefined,
    })
    .setDescription(question);

  const voteRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setLabel('Results')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`results`),
    new ButtonBuilder()
      .setEmoji('1️⃣')
      .setStyle(ButtonStyle.Primary)
      .setCustomId(`choice-custom-packId-questionId-0`),
    new ButtonBuilder()
      .setEmoji('2️⃣')
      .setStyle(ButtonStyle.Primary)
      .setCustomId(`choice-1`)
  );

  const mainRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
    ...(chance(20)
      ? [
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.emojis.logo.id)
            .setURL(config.links.invite),
        ]
      : []),
    new ButtonBuilder()
      .setLabel('New Question')
      .setStyle(ButtonStyle.Primary)
      .setEmoji(config.emojis.replay.id)
      .setCustomId(`wyr`)
  );

  return { embeds: [embed], components: [voteRow, mainRow] };
}).build();
