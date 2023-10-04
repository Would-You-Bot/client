import path from "path";

function getPath(file: string) {
  return path.join(__dirname, "..", "..", "data", file);
}

export async function getWouldYouRather(language: string): Promise<any[]> {
  var result = [] as any[];
  await import(getPath(`rather-${language}.json`)).then((value: any) => {
    result = value.General;
  });
  return result;
}

export async function getWwyd(language: string): Promise<any[]> {
  var result = [] as any[];
  await import(getPath(`wwyd-${language}.json`)).then((value: any) => {
    result = value.General;
  });
  return result;
}

export async function getHigherLower(): Promise<any[]> {
  var result = [] as any;
  await import(getPath("hl-en_EN.json")).then((value: any) => {
    result = value.data;
  });
  return result;
}

interface NeverHaveIEverResult {
  Funny: any[];
  Basic: any[];
  Young: any[];
  Food: any[];
  RuleBreak: any[];
}

export async function getNeverHaveIEver(
  language: string,
): Promise<NeverHaveIEverResult> {
  var result = {} as NeverHaveIEverResult;

  await import(getPath(`nhie-${language}.json`)).then((value: any) => {
    result.Funny = value.Funny;
    result.Basic = value.Funny;
    result.Young = value.Young;
    result.Food = value.Food;
    result.RuleBreak = value.RuleBreak;
  });

  return result;
}
