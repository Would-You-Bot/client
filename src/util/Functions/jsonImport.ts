import path from "path";
import { GuildModel, IGuildModel } from "../Models/guildModel";
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
  premium: Boolean,
  enabled: Boolean = true,
): Promise<QuestionResult> {
  let result;

  try {
    const truth = await getQuestionsByType(
      "truth",
      guildDb,
      language,
      premium,
      enabled,
    );
    const dare = await getQuestionsByType(
      "dare",
      guildDb,
      language,
      premium,
      enabled,
    );

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
  premium: Boolean,
  enabled: Boolean = true,
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

  let selectedModel = models[type.toLowerCase()];

  let result: QuestionResult = { id: "", question: "" };

  if (guildDb != null) {
    if (
      guildDb.customTypes !== "regular" &&
      guildDb.customMessages.filter((e) => e.type === type).length === 0
    )
      guildDb.customTypes = "regular";

    let usedQuestions = await usedQuestionModel.find({
      guildID: guildDb.guildID,
    });

    if (!usedQuestions[0] && premium && enabled) {
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

      usedQuestions = await usedQuestionModel.find({
        guildID: guildDb.guildID,
      });
    }

    async function getDBQuestion(nin: string[]) {
      return await selectedModel.aggregate([
        { $match: { id: { $nin: nin } } },
        { $sample: { size: 1 } },
      ]);
    }

    let questionDatabase = await getDBQuestion(
      premium && enabled ? usedQuestions[0][typeCheck[type]] : [],
    );
    if (!questionDatabase[0]?.id && premium && enabled) {
      await reset(type as Quest, guildDb.customTypes, guildDb.guildID, "db");
      questionDatabase = await getDBQuestion([]);
    }

    async function getRandomCustom(nin: string[]) {
      return await GuildModel.aggregate([
        { $match: { guildID: guildDb.guildID } },
        { $unwind: "$customMessages" },
        {
          $match: {
            "customMessages.id": {
              $nin: nin,
            },
            "customMessages.type": type === "whatwouldyoudo" ? "wwyd" : type,
          },
        },
        { $sample: { size: 1 } },
        {
          $project: {
            id: "$customMessages.id",
            msg: "$customMessages.msg",
            type: "$customMessages.type",
          },
        },
      ]);
    }

    let newRandomCustomQuestion = await getRandomCustom(
      premium && enabled ? usedQuestions[0][typeCheck["custom" + type]] : [],
    );

    if (!newRandomCustomQuestion[0]?.id && premium && enabled) {
      await reset(
        type as Quest,
        guildDb.customTypes,
        guildDb.guildID,
        "custom",
      );
      newRandomCustomQuestion = await getRandomCustom([]);
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

    if (premium && enabled) {
      if (guildDb.customTypes === "custom") {
        selectedModel = typeCheck["custom" + type];
      } else if (guildDb.customTypes === "mixed") {
        if (result.id === questionDatabase[0].id)
          selectedModel = typeCheck[type];
        else selectedModel = typeCheck["custom" + type];
      } else {
        selectedModel = typeCheck[type];
      }
      await usedQuestionModel.updateOne(
        { guildID: guildDb.guildID },
        { $push: { [selectedModel]: result.id } },
      );
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

  return result as QuestionResult;
}

export async function reset(
  type: Quest,
  customType: string,
  guildID: string,
  resetType: string,
): Promise<UpdateWriteOpResult> {
  let selectedModel;
  if (customType === "custom") {
    selectedModel = typeCheck["custom" + type];
  } else if (customType === "mixed") {
    if (resetType === "custom") selectedModel = typeCheck["custom" + type];
    else selectedModel = typeCheck[type];
  } else {
    selectedModel = type;
  }

  return await usedQuestionModel.updateOne(
    { guildID },
    {
      $set: {
        [selectedModel]: [],
      },
    },
  );
}
