import { BaseQuestionType } from '@typings/pack';
import { CoreButton } from '@utils/builders';

export default new CoreButton({
  id: 'question',
  description: 'Button description',
  perUser: false,
}).execute((client, interaction, args) => {
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
});
