import path from "path";
import { IGuildModel } from "../Models/guildModel";
import {
  dareModel,
  nhieModel,
  truthModel,
  wwydModel,
  wyrModel,
} from "../Models/questionModel";
import { usedQuestionModel } from "../Models/usedModel";

interface LanguageMapInterface {
  [key: string]: string;
}

const languageMap: LanguageMapInterface = {
  en_EN: "en",
  es_ES: "es",
  de_DE: "de",
  it_IT: "it",
};

import type { UpdateWriteOpResult } from "mongoose";
import shuffle from "../shuffle";

export interface QuestionResult {
  id: string;
  question: string;
}

type QuestType =
  | "wouldyourather"
  | "neverhaveiever"
  | "whatwouldyoudo"
  | "truth"
  | "dare";

type Quest =
  | "truthQuestions"
  | "customTruthQuestions"
  | "dareQuestions"
  | "customDareQuestions"
  | "wwydQuestions"
  | "customWwydQuestions"
  | "nhieQuestions"
  | "customNhieQuestions"
  | "wyrQuestions"
  | "customWyrQuestions"

const validTypes = [
  "wouldyourather",
  "neverhaveiever",
  "truth",
  "dare",
  "whatwouldyoudo",
];


interface IUsedQuestions {
  wyrQuestions: string[];
  customWyrQuestions: string[];
  nhieQuestions: string[];
  customNhieQuestions: string[];
  truthQuestions: string[];
  customTruthQuestions: string[];
  dareQuestions: string[];
  customDareQuestions: string[];
  wwydQuestions: string[];
  customWwydQuestions: string[];
}

const typeCheck: { [key: string]: keyof IUsedQuestions } = {
  wouldyourather: "wyrQuestions",
  customwouldyourather: "customWyrQuestions",
  neverhaveiever: "nhieQuestions",
  customneverhaveiever: "customNhieQuestions",
  truth: "truthQuestions",
  customtruth: "customTruthQuestions",
  dare: "dareQuestions",
  customdare: "customDareQuestions",
  whatwouldyoudo: "wwydQuestions",
  customwhatwouldyoudo: "customWwydQuestions",
};

const customTypeCheck: { [key: string]: string } = {
  wouldyourather: "wouldyourather",
  neverhaveiever: "neverhaveiever",
  truth: "truth",
  dare: "dare",
  whatwouldyoudo: "wwyd",
};

function getPath(file: string) {
  const fullPath = path.join(__dirname, "..", "..", "data", file);
  return fullPath;
}

export async function getHigherLower(): Promise<any[]> {
  let result = [] as any[];
  try {
    await import(getPath("hl-en_EN.json")).then((value) => {
      result = value.data;
    });
  } catch (error) {
    throw error;
  }
  return result;
}

export async function getRandomTod(
  guildDb: IGuildModel,
  language: string,
): Promise<QuestionResult> {
  let result;

  try {
    const truth = await getQuestionsByType("truth", guildDb, language);
    const dare = await getQuestionsByType("dare", guildDb, language);

    result = Math.random() < 0.5 ? truth : dare;
  } catch (error) {
    throw error;
  }

  return result;
}

export async function getQuestionsByType(
  type: string,
  guildDb: IGuildModel,
  language: string,
): Promise<QuestionResult> {
    if (!validTypes.includes(type)) {
      return Promise.reject("Invalid type");
    }
    console.log("uwu")

    const normalizedLanguage = languageMap[language] || "en";

    const models: { [key: string]: any } = {
      wouldyourather: wyrModel,
      neverhaveiever: nhieModel,
      truth: truthModel,
      dare: dareModel,
      whatwouldyoudo: wwydModel,
    };

    const selectedModel = models[type.toLowerCase()];

    let result: QuestionResult = { id: "", question: "" };

    if (guildDb != null) {
      const usedQuestions = await usedQuestionModel.find({
        guildID: guildDb.guildID,
      });
      console.log("no spam pls " + String(usedQuestions[0][typeCheck[type]]));

      const questionDatabase = await selectedModel.aggregate([
        { $match: { id: { $nin: usedQuestions[0][typeCheck[type]] } } },
        { $sample: { size: 1 } },
      ]);

      if (!questionDatabase[0]?.id) {
        console.log(questionDatabase)
        console.log("reset");
        await reset(type as Quest, guildDb.customTypes, guildDb.guildID);
        return getQuestionsByType(type, guildDb, language);
      }

      const randomCustomQuestion = shuffle(
        guildDb.customMessages.filter(
          (q) => q.type === type &&
            !usedQuestions[0][typeCheck[customTypeCheck["custom" + type]]].includes(q.id)
        )
      )[0];
      console.log("debug: " + !usedQuestions[0][typeCheck[customTypeCheck["custom" + type]]])

      if(!randomCustomQuestion) {
        console.log(randomCustomQuestion);
        guildDb.customTypes = "regular";
      }

      switch (guildDb.customTypes) {
        case "regular":
          result = {
            id: questionDatabase[0].id,
            question:
              normalizedLanguage === "en"
                ? questionDatabase[0].question
                : questionDatabase[0].translations[normalizedLanguage],
          };
          console.log(result);
          console.log("regular");
          break;
        case "mixed":
          const mixedQuestions = shuffle([
            ...questionDatabase.concat(randomCustomQuestion),
          ]);

          result = {
            id: mixedQuestions[0].id,
            question:
              normalizedLanguage === "en"
                ? mixedQuestions[0].msg || mixedQuestions[0].question
                : mixedQuestions[0].msg ||
                  mixedQuestions[0].translations[normalizedLanguage],
          };
          console.log(result);
          console.log("mixed");
          break;
        case "custom":
        // result = {
        //   id: randomCustomQuestion.id,
        //   question: randomCustomQuestion.msg,
        // };
        // console.log(result);
        // console.log("custom");
          break;
      }
    } else {
      const questionDatabase = await selectedModel.aggregate([
        { $sample: { size: 1 } },
      ]);

      result = {
        id: questionDatabase[0].id,
        question:
          normalizedLanguage === "en"
            ? questionDatabase[0].question
            : questionDatabase[0].translations[normalizedLanguage],
      };
      console.log(result);
      console.log("no guild");
    }

    if (guildDb) {

      let selectedModel;

      if(guildDb.customTypes === "custom") {
        selectedModel = typeCheck[`custom${type}`];
      } else {
        selectedModel = typeCheck[type];
      }

      await usedQuestionModel.updateOne(
        { guildID: guildDb.guildID },
        { $push: { [selectedModel]: result.id } },
      );
    }

    return result as QuestionResult;
}

export async function reset(
  type: Quest,
  customType: string,
  guildID: string,
): Promise<UpdateWriteOpResult> {

  let selectedModel;

  if(customType === "custom") {
    selectedModel = typeCheck[`custom${type}`];
    console.log(selectedModel);
  } else {
    selectedModel = typeCheck[type];
    console.log(selectedModel);
  }
  console.log(selectedModel);

  return await usedQuestionModel.updateOne(
    { guildID },
    {
      $set: {
        [selectedModel]: [],
      },
    },
  );
}
