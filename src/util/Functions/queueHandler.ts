import {
  wyrModel,
  nhieModel,
  truthModel,
  dareModel,
  wwydModel,
} from "../Models/questionModel";
import shuffle from "../shuffle";
import { IGuildModel } from "../Models/guildModel";
import { usedQuestionModel, IUsedQuestions } from "../Models/usedModel";
import { getQuestionsByType, QuestionResult } from "../Functions/jsonImport";
import { Error as MongooseError } from "mongoose";

type Quest =
  | "truthQuestions"
  | "dareQuestions"
  | "wwydQuestions"
  | "nhieQuestions"
  | "wyrQuestions";
type QuestType =
  | "wouldyourather"
  | "neverhaveiever"
  | "whatwouldyoudo"
  | "truth"
  | "dare";
const typeCheck: { [key: string]: string } = {
  wouldyourather: "wyr",
  neverhaveiever: "nhie",
  truth: "truth",
  dare: "dare",
  whatwouldyoudo: "wwyd",
};
const models: { [key: string]: any } = {
  wouldyourather: wyrModel,
  neverhaveiever: nhieModel,
  truth: truthModel,
  dare: dareModel,
  whatwouldyoudo: wwydModel,
};

export async function markQuestionAsUsed(
  guildID: string,
  question: string,
  type: string,
) {
  const validTypes = [
    "truth",
    "dare",
    "whatwouldyoudo",
    "wouldyourather",
    "neverhaveiever",
  ];

  if (!validTypes.includes(type.toLowerCase())) {
    throw new Error("Invalid question type");
  }

  try {
    let questionDoc = await usedQuestionModel.findOneAndUpdate(
      {
        guildID,
        [`${typeCheck[type]}Questions`]: { $ne: question }, // Check for non-existence
      },
      { $push: { [`${typeCheck[type]}Questions`]: question } },
      { new: true, upsert: true },
    );

    return questionDoc;
  } catch (error: MongooseError | any) {
    if (error.codeName === "DuplicateKey" && error.code === 11000) {
      console.log("Duplicate key error, resetting the questions");
      reset(guildID, { quest: type as Quest, questType: type as QuestType });
    }
    return true;
  }
}

async function reset(
  guildID: string,
  type: { quest: Quest; questType: QuestType },
) {
  return await usedQuestionModel.findOneAndUpdate(
    { guildID },
    { $set: { [`${typeCheck[type.questType]}Questions`]: [] } },
  );
}

export async function Questions(
  chose: QuestionResult,
  guild: IUsedQuestions | null,
  guildDb: IGuildModel | null,
  type: { quest: Quest; questType: QuestType },
  num: number = 0,
) {
  if (!guild)
    guild = await usedQuestionModel.findOne({ guildID: guildDb?.guildID });

  const modal = await models[type.questType.toLowerCase()].aggregate([
    { $sample: { size: 1 } },
  ]);

  const unusedQuestions = modal.filter(
    (questionId: string) => !guild![type.quest].includes(questionId),
  );
  
  if (!unusedQuestions.length) {
    console.log("All questions have been used");
    reset(guildDb?.guildID!, type);
    return;
  }

  const shuffledQuestion = shuffle([...unusedQuestions]);
  const randomIndex = Math.floor(Math.random() * shuffledQuestion.length);
  const question = shuffledQuestion[randomIndex];
  
  console.log(num);

  if (guild![type.quest].includes(chose.id)) {
    return await Questions(question, guild, guildDb, type, num + 1);
  } else {
    if (num > 0) {
      await markQuestionAsUsed(guildDb!.guildID!, chose.id, type.questType);
    }
    return chose;
  }
}
