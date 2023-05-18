import { CoreLanguage } from './core';

export enum BaseQuestionType {
  WouldYouRather = 0,
  NeverHaveIEver = 1,
  WhatWouldYouDo = 2,
  TruthOrDare = 3,
}

interface BaseQuestion {
  id: string;
  translations: Record<CoreLanguage, string>;
  choices?: [number, number];
}

export interface BasePack {
  name: string;
  questionType: BaseQuestionType;
  questions: BaseQuestion[];
}

interface CustomQuestion {
  id: string;
  tex: string;
  choices?: [number, number];
}

export interface CustomPack {
  guildId: string;
  name: string;
  questionType: BaseQuestionType;
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
