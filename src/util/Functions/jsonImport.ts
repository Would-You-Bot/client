import path from "node:path";
import { GuildModel, type IGuildModel } from "../Models/guildModel";
import {
  dareModel,
  nhieModel,
  topicModel,
  truthModel,
  wwydModel,
  wyrModel,
} from "../Models/questionModel";
import { usedQuestionModel } from "../Models/usedModel";

// interface LanguageMapInterface {
//   [key: string]: string;
// }

// const languageMap: LanguageMapInterface = {
//   en_EN: "en_EN",
//   es_ES: "es",
//   de_DE: "de",
//   it_IT: "it",
// };

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
  | "wyrQuestions"
  | "topicQuestions";

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
  "topic",
  "customtopic",
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
  topicQuestions: string[];
  customTopicQuestions: string[];
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
  topic: "topicQuestions",
  customtopic: "customTopicQuestions",
};

function getPath(file: string) {
  const fullPath = path.join(__dirname, "..", "..", "data", file);
  return fullPath;
}

export async function getHigherLower(): Promise<any[]> {
  let result = [] as any[];
  await import(getPath("hl-en_EN.json")).then((value) => {
    result = value.data;
  });
  return result;
}

export async function getRandomTod(
  channel: string,
  guildDb: IGuildModel,
  language: string,
  premium: boolean,
  enabled = true,
): Promise<QuestionResult> {
  const truth = await getQuestionsByType(
    channel,
    "truth",
    guildDb,
    language,
    premium,
    enabled,
  );
  const dare = await getQuestionsByType(
    channel,
    "dare",
    guildDb,
    language,
    premium,
    enabled,
  );

  return Math.random() < 0.5 ? truth : dare;
}

export async function getQuestionsByType(
  channel: string | undefined,
  type: string,
  guildDb: IGuildModel,
  language: string,
  premium: boolean,
  enabled = true,
): Promise<QuestionResult> {
  if (!validTypes.includes(type)) {
    return Promise.reject("Invalid type");
  }

  const normalizedLanguage = language || "en_EN";
  const models: { [key: string]: any } = {
    wouldyourather: wyrModel,
    neverhaveiever: nhieModel,
    truth: truthModel,
    dare: dareModel,
    whatwouldyoudo: wwydModel,
    topic: topicModel,
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
            question: "$customMessages.question",
            type: "$customMessages.type",
          },
        },
      ]);
    }

    let newRandomCustomQuestion = await getRandomCustom(
      premium && enabled ? usedQuestions[0][typeCheck[`custom${type}`]] : [],
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

    let types =
      guildDb.channelTypes.find((e) => e.channelId === channel)?.questionType ||
      guildDb.customTypes;

    if (guildDb.welcome && guildDb.welcomeChannel === channel) {
      types = guildDb.welcomeType;
    }

    switch (types) {
      case "regular":
        result = {
          id: questionDatabase[0].id,
          question:
            normalizedLanguage === "en_EN"
              ? questionDatabase[0].question
              : questionDatabase[0].translations[normalizedLanguage],
        };

        break;
      case "mixed": {
        const mixedQuestions = shuffle([
          ...questionDatabase.concat(newRandomCustomQuestion[0]),
        ]);

        let question = mixedQuestions[0]
          ? mixedQuestions[0]
          : mixedQuestions[1];

        result = {
          id: question?.id,
          question:
            normalizedLanguage === "en_EN"
              ? question?.question
              : question?.translations?.[normalizedLanguage] ||
                question?.question,
        };
        break;
      }
      case "custom":
        result = {
          id: newRandomCustomQuestion[0].id,
          question: newRandomCustomQuestion[0].question,
        };
        break;
    }

    if (premium && enabled) {
      if (types === "custom") {
        selectedModel = typeCheck[`custom${type}`];
      } else if (types === "mixed") {
        if (result.id === questionDatabase[0].id)
          selectedModel = typeCheck[type];
        else selectedModel = typeCheck[`custom${type}`];
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
        normalizedLanguage === "en_EN"
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
  let selectedModel: string;
  if (customType === "custom") {
    selectedModel = typeCheck[`custom${type}`];
  } else if (customType === "mixed") {
    if (resetType === "custom") selectedModel = typeCheck[`custom${type}`];
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
