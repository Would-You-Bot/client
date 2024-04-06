import {
  wyrModel,
  nhieModel,
  truthModel,
  dareModel,
  wwydModel,
} from "../Models/questionModel";
import { IGuildModel } from "../Models/guildModel";
import { Questions } from "../Functions/queueHandler";
import path from "path";

interface LanguageMapInterface {
  [key: string]: string;
}

const languageMap: LanguageMapInterface = {
  en_EN: "en",
  es_ES: "es",
  de_DE: "de",
  it_IT: "it",
};

import shuffle from "../shuffle";
import { markQuestionAsUsed, } from "./queueHandler";

export interface QuestionResult {
  id: string;
  question: string;
}

type QuestType = "wouldyourather"
  | "neverhaveiever"
  | "whatwouldyoudo"
  | "truth"
  | "dare";
type Quest = "truthQuestions"
  | "dareQuestions"
  | "wwydQuestions"
  | "nhieQuestions"
  | "wyrQuestions";
const validTypes = [
  "wouldyourather",
  "neverhaveiever",
  "truth",
  "dare",
  "whatwouldyoudo",
];
const typeCheck: { [key: string]: string } = {
  wouldyourather: "wyrQuestions",
  neverhaveiever: "nhieQuestions",
  truth: "truthQuestions",
  dare: "dareQuestions",
  whatwouldyoudo: "wwydQuestions",
};

function getPath(file: string) {
  return path.join(__dirname, "..", "..", "data", file);
}

interface HigherLowerJsonModel {
  id: string;
  keyword: string;
  value: number;
  author: string;
  link: string;
}


export async function getHigherLower(): Promise<HigherLowerJsonModel[]> {
  let result = [] as HigherLowerJsonModel[];
  await import(getPath("hl-en_EN.json")).then((value) => {
    result = value.data;
  });
  return result;
}

export async function getRandomTod(language: string): Promise<string[]> {
  let result = [] as string[];
  const truth = await import(getPath(`truth-${language}.json`));
  const dare = await import(getPath(`dare-${language}.json`));

  if (Math.random() < 0.5) {
    result = truth.General;
  } else {
    result = dare.General;
  }
  return result;
}

export async function getQuestionsByType(
  type: string,
  guildDb: IGuildModel | null,
): Promise<QuestionResult> {
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid question type: ${type}`);
  }

  // TODO: Make this work with the language system
  const normalizedLanguage =
    languageMap[guildDb?.language != null ? guildDb.language : "en_EN"];

  const models: { [key: string]: any } = {
    wouldyourather: wyrModel,
    neverhaveiever: nhieModel,
    truth: truthModel,
    dare: dareModel,
    whatwouldyoudo: wwydModel,
  };

  const selectedModel = models[type.toLowerCase()];

  let result = {} as QuestionResult;

  if (!selectedModel) {
    throw new Error(`Invalid question type: ${type}`);
  }

  const questions = await selectedModel.aggregate([{ $sample: { size: 1 } }]);

  if (questions.length === 0) {
    throw new Error("No questions found");
  }

  if (guildDb != null) {
    const dbquestions = guildDb.customMessages.filter(
      (c) => c.type === "dare" || c.type === "truth",
    );
    if (!dbquestions.length) guildDb.customTypes = "regular";

    const Random = Math.floor(Math.random() * dbquestions.length);

    switch (guildDb.customTypes) {
      case "regular":
        result = {
          id: questions[0].id,
          question:
            normalizedLanguage === "en"
              ? questions[0].question
              : questions[0].translations[normalizedLanguage],
        };
        break;
      case "mixed":
        const mixedQuestions = shuffle([
          ...questions.concat(dbquestions[Random]),
        ]);

        result = {
          id: mixedQuestions[0].id,
          question:
            normalizedLanguage === "en"
              ? mixedQuestions[0].msg
                ? mixedQuestions[0].msg
                : mixedQuestions[0].question
              : mixedQuestions[0].msg
                ? mixedQuestions[0].msg
                : mixedQuestions[0].translations[normalizedLanguage],
        };
        break;
      case "custom":
        result = {
          id: dbquestions[Random].id,
          question: dbquestions[Random].msg,
        };
        break;
    }
  } else {
    result = {
      id: questions[0].id,
      question:
        normalizedLanguage === "en"
          ? questions[0].question
          : questions[0].translations[normalizedLanguage],
    };
  }

  result = await Questions(result, null, guildDb, {
    quest: typeCheck[type] as Quest,
    questType: type as QuestType,
  });
  return result;
}
