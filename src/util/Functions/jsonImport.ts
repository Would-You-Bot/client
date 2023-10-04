import path from "path";

export async function getWouldYouRather(language: string): Promise<any[]>{
    var result = [] as any[];
    await import(
        path.join(
          __dirname,
          "..",
          "..",
          "data",
          `rather-${language}.json`,
        )
      ).then((value: any) => {
        result = value.General;
      });
      return result;
}

export async function getWwyd(language: string): Promise<any[]>{
    var result = [] as any[];
    await import(
        path.join(
          __dirname,
          "..",
          "..",
          "data",
          `wwyd-${language}.json`,
        )
      ).then((value: any) => {
        result = value.General;
      });
      return result;
}      

export async function getHigherLower(): Promise<any[]>{
    var result = [] as any;
    await import(
        path.join(
          __dirname,
          "..",
          "..",
          "data",
          "hl-en_EN.json",
        )
      ).then((value: any) => {
        result = value.data;
      });
      return result;
} 

interface NeverHaveIEverResult{
    Funny: any[],
    Basic: any[],
    Young: any[],
    Food: any[],
    RuleBreak: any[]
}
export async function getNeverHaveIEver(language: string): Promise<NeverHaveIEverResult>{
    var Funny = [] as any[];
    var Basic = [] as any[];
    var Young = [] as any[];
    var Food = [] as any[];
    var RuleBreak = [] as any[];

    await import(
        path.join(
          __dirname,
          "..",
          "..",
          "data",
          `nhie-${language}.json`,
        )
      ).then((value: any) => {
        Funny = value.Funny;
        Basic = value.Funny;
        Young = value.Young;
        Food = value.Food;
        RuleBreak = value.RuleBreak;
      });

    return { Funny: Funny, Basic: Basic, Young: Young, Food: Food, RuleBreak: RuleBreak };
}