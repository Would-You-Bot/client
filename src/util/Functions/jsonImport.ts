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

interface LanguageMapInterface {
  [key: string]: string;
}

const languageMap: LanguageMapInterface = {
  en_EN: "en_EN",
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
  enabled = true
): Promise<QuestionResult> {
  const truth = await getQuestionsByType(
    channel,
    "truth",
    guildDb,
    language,
    premium,
    enabled
  );
  const dare = await getQuestionsByType(
    channel,
    "dare",
    guildDb,
    language,
    premium,
    enabled
  );

  return Math.random() < 0.5 ? truth : dare;
}

export async function getQuestionsByType(
  channel: string | undefined,
  type: string,
  guildDb: IGuildModel,
  language: string,
  premium: boolean,
  enabled = true
): Promise<QuestionResult> {
  if (!validTypes.includes(type)) {
    return Promise.reject("Invalid type");
  }

  const normalizedLanguage = languageMap[language] || "en_EN";
  const models: { [key: string]: any } = {
    wouldyourather: wyrModel,
    neverhaveiever: nhieModel,
    truth: truthModel,
    dare: dareModel,
    whatwouldyoudo: wwydModel,
    topic: topicModel,
  };

  // const selectedModel = models[type.toLowerCase()];
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
        topicQuestions: [],
        customTopicQuestions: [],
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
      premium && enabled ? usedQuestions[0][typeCheck[type]] : []
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
      premium && enabled ? usedQuestions[0][typeCheck[`custom${type}`]] : []
    );

    if (!newRandomCustomQuestion[0]?.id && premium && enabled) {
      await reset(
        type as Quest,
        guildDb.customTypes,
        guildDb.guildID,
        "custom"
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

        const question = mixedQuestions[0]
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
        { $push: { [selectedModel]: result.id } }
      );
    }

    // @@ TODO: Make the below code work in the future, but currently it doesn't work - ForGetFulSkyBro

    // interface QuestionData {
    //   id: string;
    //   question: string;
    //   translations?: { [key: string]: string };
    //   type?: string;
    // }

    // async function getRandomCustom(nin: string[]) {
    //   const customCount = await GuildModel.aggregate([
    //     { $match: { guildID: guildDb.guildID } },
    //     { $unwind: "$customMessages" },
    //     {
    //       $match: {
    //         "customMessages.type": type === "whatwouldyoudo" ? "wwyd" : type,
    //       },
    //     },
    //     { $count: "total" },
    //   ]);

    //   if (!customCount[0]?.total) {
    //     return null;
    //   }

    //   const availableCustomQuestions = await GuildModel.aggregate([
    //     { $match: { guildID: guildDb.guildID } },
    //     { $unwind: "$customMessages" },
    //     {
    //       $match: {
    //         "customMessages.type": type === "whatwouldyoudo" ? "wwyd" : type,
    //         "customMessages.id": { $nin: nin },
    //       },
    //     },
    //     {
    //       $project: {
    //         id: "$customMessages.id",
    //         question: "$customMessages.question",
    //         type: "$customMessages.type",
    //       },
    //     },
    //   ]);

    //   if (availableCustomQuestions.length === 0) {
    //     await reset(type as Quest, "custom", guildDb.guildID, "custom");

    //     const allCustomQuestions = await GuildModel.aggregate([
    //       { $match: { guildID: guildDb.guildID } },
    //       { $unwind: "$customMessages" },
    //       {
    //         $match: {
    //           "customMessages.type": type === "whatwouldyoudo" ? "wwyd" : type,
    //         },
    //       },
    //       {
    //         $project: {
    //           id: "$customMessages.id",
    //           question: "$customMessages.question",
    //           type: "$customMessages.type",
    //         },
    //       },
    //     ]);

    //     const randomIndex = Math.floor(
    //       Math.random() * allCustomQuestions.length
    //     );
    //     return [allCustomQuestions[randomIndex]];
    //   }

    //   const randomIndex = Math.floor(
    //     Math.random() * availableCustomQuestions.length
    //   );
    //   return [availableCustomQuestions[randomIndex]];
    // }

    // const hasCustomQuestions = await GuildModel.aggregate([
    //   { $match: { guildID: guildDb.guildID } },
    //   { $unwind: "$customMessages" },
    //   {
    //     $match: {
    //       "customMessages.type": type === "whatwouldyoudo" ? "wwyd" : type,
    //     },
    //   },
    //   { $count: "total" },
    // ]);

    // if (hasCustomQuestions[0]?.total > 0) {
    //   const customQuestion = await getRandomCustom(
    //     premium && enabled
    //       ? usedQuestions[0]?.[typeCheck[`custom${type}`]] || []
    //       : []
    //   );

    //   if (!customQuestion?.[0]) {
    //     return Promise.reject("Error getting custom question");
    //   }

    //   if (premium && enabled) {
    //     await usedQuestionModel.updateOne(
    //       { guildID: guildDb.guildID },
    //       { $push: { [typeCheck[`custom${type}`]]: customQuestion[0].id } }
    //     );
    //   }

    //   return {
    //     id: customQuestion[0].id,
    //     question: customQuestion[0].question,
    //   };
    // }

    // // Only get normal questions if there are no custom questions configured
    // let questionDatabase = await getDBQuestion(
    //   premium && enabled ? usedQuestions[0]?.[typeCheck[type]] || [] : []
    // );

    // if (!questionDatabase[0]?.id && premium && enabled) {
    //   await reset(type as Quest, "regular", guildDb.guildID, "db");
    //   questionDatabase = await getDBQuestion([]);
    // }

    // if (!questionDatabase[0]) {
    //   return Promise.reject("No questions available");
    // }

    // const dbQuestion = questionDatabase[0] as QuestionData;

    // // Track the used normal question for premium users
    // if (premium && enabled) {
    //   await usedQuestionModel.updateOne(
    //     { guildID: guildDb.guildID },
    //     { $push: { [typeCheck[type]]: dbQuestion.id } }
    //   );
    // }

    // let types =
    //   guildDb.channelTypes.find((e) => e.channelId === channel)?.questionType ||
    //   guildDb.customTypes;

    // if (guildDb.welcome && guildDb.welcomeChannel === channel) {
    //   types = guildDb.welcomeType;
    // }

    // switch (types) {
    //   case "regular":
    //     result = {
    //       id: dbQuestion.id,
    //       question:
    //         normalizedLanguage === "en_EN"
    //           ? dbQuestion.question
    //           : dbQuestion.translations?.[normalizedLanguage] ||
    //             dbQuestion.question,
    //     };
    //     break;
    //   case "mixed": {
    //     const availableQuestions = questionDatabase.map(
    //       (q: any) => ({ ...q }) as QuestionData
    //     );
    //     const mixedQuestions = shuffle(availableQuestions);
    //     const question = mixedQuestions[0] as QuestionData;

    //     if (!question) {
    //       return Promise.reject("No questions available");
    //     }

    //     result = {
    //       id: question.id,
    //       question:
    //         normalizedLanguage === "en_EN"
    //           ? question.question
    //           : question.translations?.[normalizedLanguage] ||
    //             question.question,
    //     };
    //     break;
    //   }
    //   case "custom":
    //     result = {
    //       id: dbQuestion.id,
    //       question:
    //         normalizedLanguage === "en_EN"
    //           ? dbQuestion.question
    //           : dbQuestion.translations?.[normalizedLanguage] ||
    //             dbQuestion.question,
    //     };
    //     break;
    // }

    
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
  resetType: string
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
    }
  );
}
