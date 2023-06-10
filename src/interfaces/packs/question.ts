import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { CoreInterfaceFunction } from '@typings/core';
import { PackQuestionType } from '@typings/pack';

/**
 * The function return the default interface.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @param params The params passed to the button.
 * @param params.interaction The button interaction.
 * @param params.questionType The question type.
 * @returns An object containing the embed and buttons.
 */
export default <CoreInterfaceFunction>((
  client,
  guildProfile,
  {
    interaction,
    questionType,
  }: { interaction: BaseInteraction; questionType: PackQuestionType }
) => {
  const translations = client.translations[guildProfile.language];

  client.packs.random(2);
  const question = '';

  const embed = new EmbedBuilder().setDescription(question).setFooter({
    text: interaction.user.username,
    iconURL: interaction.user.displayAvatarURL(),
  });

  const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder().setCustomId(
      `question-results-${pack.id}-${question.id}`
    )
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setCustomId(`question-${PackQuestionType.WouldYouRather}`)
      .setEmoji(config.emojis.refresh.full)
      .setLabel('New Question')
  );

  return {
    embeds: [embed],
    components: [row2],
  };
});
