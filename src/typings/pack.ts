import { CoreLanguage } from './core';

export enum BaseQuestionType {
  WouldYouRather = 0,
  NeverHaveIEver = 1,
  WhatWouldYouDo = 2,
  TruthOrDare = 3,
}

export interface BaseQuestion {
  id: string;
  questionType: BaseQuestionType;
  translations: Record<CoreLanguage, string>;
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
  guildId: string;
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
