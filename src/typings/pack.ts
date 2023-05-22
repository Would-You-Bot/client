import { GuildLanguage } from './guild';

export enum BaseQuestionType {
  WouldYouRather = 0,
  NeverHaveIEver = 1,
  WhatWouldYouDo = 2,
  TruthOrDare = 3,
  HigherOrLower = 4,
}

export interface BaseQuestion {
  id: string;
  questionType: BaseQuestionType;
  translations: Record<GuildLanguage, string>;
  choices?: [number, number];
}

export interface BasePack {
  name: string;
  questions: BaseQuestion[];
}

export interface CustomQuestion {
  id: string;
  questionType: BaseQuestionType;
  text: string;
  choices?: [number, number];
}

export interface CustomPack {
  userId: string;
  name: string;
  questions: CustomQuestion[];
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
