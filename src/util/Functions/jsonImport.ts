import path from "path";
import { IGuildModel } from "../Models/guildModel";
import { usedQuestionModel } from "../Models/usedModel";
import {
  dareModel,
  nhieModel,
  truthModel,
  wwydModel,
  wyrModel,
  IQuestionModel,
} from "../Models/questionModel";


import * as winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

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
import type { MongooseError, UpdateWriteOpResult } from "mongoose";

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
  const fullPath = path.join(__dirname, "..", "..", "data", file);
  logger.debug(`Getting path for file: ${file}, Full path: ${fullPath}`);
  return fullPath;
}

export async function getHigherLower(): Promise<any[]> {
  logger.info('Fetching HigherLower data');
  let result = [] as any[];
  try {
    await import(getPath("hl-en_EN.json")).then((value) => {
      result = value.data;
    });
    logger.debug(`HigherLower data fetched, length: ${result.length}`);
  } catch (error) {
    logger.error('Error fetching HigherLower data', { error });
    throw error;
  }
  return result;
}

export async function getRandomTod(
  guildDb: IGuildModel,
  language: string,
): Promise<QuestionResult> {
  logger.info(`Getting random ToD for guild: ${guildDb.guildID}, language: ${language}`);
  let result;

  try {
    const truth = await getQuestionsByType("truth", guildDb, language);
    const dare = await getQuestionsByType("dare", guildDb, language);

    result = Math.random() < 0.5 ? truth : dare;
    logger.debug(`Random ToD result: ${result.id}`);
  } catch (error) {
    logger.error('Error getting random ToD', { error, guildId: guildDb.guildID, language });
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



  console.log(selectedModel);

  let result: QuestionResult | Object = {};

  const usedQuqestions = await usedQuestionModel.find({ guildID: guildDb.guildID });

  console.log(usedQuqestions[0]["wwydQuestions"]);

  const questionDatabase = await selectedModel.aggregate([
    { $match: { "id": { $nin: usedQuqestions[0]["wwydQuestions"] } } },
    { $sample: { size: 1 } }
  ])
    .catch((err: MongooseError) => {
      console.log(err)
    });

    console.log(questionDatabase);

    console.log(questionDatabase[0].id);

   //if (questionDatabase?.length === 0) {
   //  console.log('No questions found')
   //  reset(type as Quest, guildDb.guildID);
   //}

  //result = questionDatabase;

  
return Promise.resolve({id: '1', question: 'test'});
}

export async function reset(type: Quest, guildID: string): Promise<UpdateWriteOpResult> {

  const selectedModel = typeCheck[type];

  return await usedQuestionModel.updateOne(
    { guildID },
    { $set: { 
        [selectedModel]: [],
      } 
    }
  )

}
