import { ActionRowBuilder, BaseInteraction, ButtonBuilder, EmbedBuilder } from 'discord.js';

import config from '@config';
import { CoreInterface } from '@typings/core';
import { BaseQuestionType } from '@typings/pack';

/**
 * The function return the default interface.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @param params The params passed to the button.
 * @param params.interaction The button interaction.
 * @param params.questionType The question type.
 * @returns An object containing the embed and buttons.
 */
export default <CoreInterface>((
  client,
  guildProfile,
  { interaction, questionType }: { interaction: BaseInteraction; questionType: BaseQuestionType }
) => {
  const translations = client.translations[guildProfile.language];

  client.packs.random(2);
  const question = '';

  const embed = new EmbedBuilder().setDescription(question).setFooter({
    text: interaction.user.username,
    iconURL: interaction.user.displayAvatarURL(),
  });

  const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder().setCustomId(`question-results-${pack.id}-${question.id}`)
  );

  const row2 = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setCustomId(`question-${BaseQuestionType.WouldYouRather}`)
      .setEmoji(config.emojis.refresh.full)
      .setLabel('New Question')
  );

  return {
    embeds: [embed],
    components: [row2],
  };
});
