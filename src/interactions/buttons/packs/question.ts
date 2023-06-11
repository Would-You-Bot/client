import { CoreButton } from '@utils/builders';
import { PackQuestionType } from '@would-you/types';

export default new CoreButton({
  id: 'question',
  description: 'Button description',
  perUser: false,
}).execute((client, interaction, args) => {
  if (!args) return;

  const questionType = parseInt(args[1], 10);

  switch (questionType) {
    case PackQuestionType.WouldYouRather:
      break;

    case PackQuestionType.NeverHaveIEver:
      break;

    case PackQuestionType.WhatWouldYouDo:
      break;

    case PackQuestionType.TruthOrDare:
      break;

    case PackQuestionType.HigherOrLower:
      break;

    default:
      return null;
  }
});
