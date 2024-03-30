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
let question: any;

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

export async function Questions(
  chose: QuestionResult,
  guild: IUsedQuestions | null,
  guildDb: IGuildModel | null,
  type: { quest: Quest; questType: QuestType },
  num: number = 0,
) {
  if (!guild)
    guild = await usedQuestionModel.findOne({ guildID: guildDb?.guildID });
  question = await models[type.questType.toLowerCase()].aggregate([
    { $sample: { size: 1 } },
  ]);
  question = question.filter(
    (questionId: string) => !guild![type.quest].includes(questionId),
  );
  question = shuffle([...question]);
  const Random = Math.floor(Math.random() * question.length);
  question = question[Random];
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
