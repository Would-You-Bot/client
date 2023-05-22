import { ButtonInteraction } from 'discord.js';

import { CoreButton } from '@typings/core';
import { BaseQuestionType } from '@typings/pack';

export default <CoreButton>{
  id: 'question',
  description: 'Button description',
  perUser: false,
  /**
   * The function that is executed when the button is pressed.
   * @param client The extended client.
   * @param interaction The button interaction.
   * @param args The arguments passed to the button.
   * @returns A promise that resolves to an unknown value.
   */
  execute: async (client, interaction: ButtonInteraction, args: string[]) => {
    const questionType = parseInt(args[1], 10);

    switch (questionType) {
      case BaseQuestionType.WouldYouRather:
        break;

      case BaseQuestionType.NeverHaveIEver:
        break;

      case BaseQuestionType.WhatWouldYouDo:
        break;

      case BaseQuestionType.TruthOrDare:
        break;

      case BaseQuestionType.HigherOrLower:
        break;

      default:
        return null;
    }
  },
};
