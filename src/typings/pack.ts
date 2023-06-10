import { GuildLanguage } from './guild';

export enum PackQuestionType {
  WouldYouRather = 0,
  NeverHaveIEver = 1,
  WhatWouldYouDo = 2,
  TruthOrDare = 3,
  HigherOrLower = 4,
}

export interface BaseQuestion {
  packId?: string;
  id: string;
  questionType: PackQuestionType;
  translations: Record<GuildLanguage, string>;
  choices?: [number, number];
}

export interface BasePack {
  name: string;
  description: string;
  tags: string[];
  likes: string[];
  questions: BaseQuestion[];
}

export interface CustomQuestion {
  packId?: string;
  id: string;
  questionType: PackQuestionType;
  text: string;
  choices?: [number, number];
}

export interface CustomPack {
  userId: string;
  name: string;
  description: string;
  tags: string[];
  likes: string[];
  questions: CustomQuestion[];
  visible: boolean;
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
