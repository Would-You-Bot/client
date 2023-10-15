import path from "path";

function getPath(file: string) {
  return path.join(__dirname, "..", "..", "data", file);
}

export async function getWouldYouRather(language: string): Promise<string[]> {
  var result = [] as string[];
  await import(getPath(`rather-${language}.json`)).then((value) => {
    result = value.General;
  });
  return result;
}

export async function getWwyd(language: string): Promise<string[]> {
  var result = [] as string[];
  await import(getPath(`wwyd-${language}.json`)).then((value) => {
    result = value.WhatYouDo;
  });
  return result;
}

interface HigherLowerJsonModel {
  id: string;
  keyword: string;
  value: number;
  author: string;
  link: string;
}

export async function getHigherLower(): Promise<HigherLowerJsonModel[]> {
  var result = [] as HigherLowerJsonModel[];
  await import(getPath("hl-en_EN.json")).then((value) => {
    result = value.data;
  });
  return result;
}

interface NeverHaveIEverResult {
  Funny: string[];
  Basic: string[];
  Young: string[];
  Food: string[];
  RuleBreak: string[];
}

export async function getNeverHaveIEver(
  language: string,
): Promise<NeverHaveIEverResult> {
  var result = {} as NeverHaveIEverResult;

  await import(getPath(`nhie-${language}.json`)).then((value) => {
    result.Funny = value.Funny;
    result.Basic = value.Funny;
    result.Young = value.Young;
    result.Food = value.Food;
    result.RuleBreak = value.RuleBreak;
  });

  return result;
}
