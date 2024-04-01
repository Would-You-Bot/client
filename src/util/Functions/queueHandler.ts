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
  guildID: number,
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
  } catch (error) {
    return true;
    console.error("Error marking question as used:", error);
  }
}

async function reset(
  guildID: string,
  type: { quest: Quest; questType: QuestType },
) {
  await usedQuestionModel.findOneAndUpdate(
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
  let question: any;
  if (!guild)
    guild = await usedQuestionModel.findOne({ guildID: guildDb?.guildID });
  let modal = await models[type.questType.toLowerCase()].aggregate([
    { $sample: { size: 1 } },
  ]);
  question = modal.filter(
    (questionId: string) => !guild![type.quest].includes(questionId),
  );
  question = shuffle([...question]);
  const Random = Math.floor(Math.random() * question.length);
  question = question[Random];

  if (!guild![type.quest].length >= modal.length)
    reset(guildDb?.guildID!, type);
  if (guild![type.quest].includes(chose.id)) {
    return Questions(question, guild, guildDb, type, num++);
  } else {
    if (num > 0)
      await markQuestionAsUsed(
        guildDb?.guildID as unknown as number,
        chose.id,
        type.questType,
      );

    return chose;
  }
}
