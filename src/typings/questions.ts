export enum BaseQuestionType {
  WouldYouRather = 0,
  NeverHaveIEver = 1,
  WhatWouldYouDo = 2,
  TruthOrDare = 3,
}

interface BaseQuestion {
  id: string;
  text: string;
  choices?: [number, number];
}

export interface BasePack {
  name: string;
  questionType: BaseQuestionType;
  questions: BaseQuestion[];
}

export interface CustomPack extends BasePack {
  guildId: string;
}

export interface UserChoices {
  packId: string;
  questionId: string;
  custom: boolean;
  choices: {
    first: string[];
    second: string[];
  };
}
