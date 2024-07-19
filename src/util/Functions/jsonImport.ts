import path from "path";
import { IGuildModel, GuildModel } from "../Models/guildModel";
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

type Quest =
  | "truthQuestions"
  | "dareQuestions"
  | "wwydQuestions"
  | "nhieQuestions"
  | "wyrQuestions";

const validTypes = [
  "wouldyourather",
  "customwouldyourather",
  "neverhaveiever",
  "customneverhaveiever",
  "truth",
  "customtruth",
  "dare",
  "customdare",
  "whatwouldyoudo",
  "customwhatwouldyoudo",
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
  neverhaveiever: "nhieQuestions",
  truth: "truthQuestions",
  dare: "dareQuestions",
  whatwouldyoudo: "wwydQuestions",
};

const resetCustomTypeCheck: { [key: string]: keyof IUsedQuestions } = {
  wouldyourather: "customWyrQuestions",
  neverhaveiever: "customNhieQuestions",
  truth: "customTruthQuestions",
  dare: "customDareQuestions",
  whatwouldyoudo: "customWwydQuestions",
};

const customTypeCheck: { [key: string]: string } = {
  customwouldyourather: "customWouldyourather",
  customneverhaveiever: "customNeverhaveiever",
  customtruth: "customTruth",
  customdare: "customDare",
  customwhatwouldyoudo: "customWwyd",
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

    if (!usedQuestions[0]) {
      await usedQuestionModel.create({
        guildID: guildDb.guildID,
        customTruthQuestions: [],
        truthQuestions: [],
        customDareQuestions: [],
        dareQuestions: [],
        customNhieQuestions: [],
        nhieQuestions: [],
        wwydQuestions: [],
        customWwydQuestions: [],
        wyrQuestions: [],
        customWyrQuestions: [],
      });
    }

    console.log(usedQuestions[0]);

    const questionDatabase = await selectedModel.aggregate([
      { $match: { id: { $nin: usedQuestions[0][typeCheck[type]] } } },
      { $sample: { size: 1 } },
    ]);

    console.log("questionDatabase 172" + questionDatabase)

    if (!questionDatabase[0]?.id && guildDb.customTypes == "regular") {
      await reset(type as any, guildDb.customTypes, guildDb.guildID);
      return getQuestionsByType(type, guildDb, language);
    }

    const newRandomCustomQuestion = await GuildModel.aggregate([
      { $match: { guildID: guildDb.guildID } },
      { $unwind: "$customMessages" },
      { $match: { 
        "customMessages.id": { $nin: usedQuestions[0][typeCheck[type]] },
        "customMessages.type": type === "whatwouldyoudo" ? "wwyd" : type
      } },
      { $sample: { size: 1 } },
      { $project: {
        id: "$customMessages.id",
        msg: "$customMessages.msg",
        type: "$customMessages.type"
      }}
    ]);

    console.log("new random questio 194" + newRandomCustomQuestion[0]?.id)

    if (!newRandomCustomQuestion[0]?.id) {
      console.log("no custom questions")
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

        break;
      case "mixed":
        const mixedQuestions = shuffle([
          ...questionDatabase.concat(newRandomCustomQuestion[0]),
        ]);

        result = {
          id: mixedQuestions[0].id,
          question:
            normalizedLanguage === "en"
              ? mixedQuestions[0].msg || mixedQuestions[0].question
              : mixedQuestions[0].msg ||
                mixedQuestions[0].translations[normalizedLanguage],
        };
        break;
      case "custom":
        result = {
          id: newRandomCustomQuestion[0].id,
          question: newRandomCustomQuestion[0].msg,
        };
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
  }

  if (guildDb) {
    let selectedModel;
    if (guildDb.customTypes === "custom") {
      selectedModel = typeCheck[customTypeCheck["custom" + type]];
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
  console.log("dominik was on line 277");
  if (customType === "custom") {
    console.log(resetCustomTypeCheck[type]);
    selectedModel = resetCustomTypeCheck[customTypeCheck["custom" + type]];
  } else {
    console.log("not custom");
    selectedModel = type;
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
