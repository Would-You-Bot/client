import { captureException } from "@sentry/node";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { ChatInputCommand } from "../../interfaces";
import { wyrModel, wwydModel, nhieModel, dareModel, truthModel, topicModel, type IQuestionModel } from "../../util/Models/questionModel";
import type { IGuildModel } from "../../util/Models/guildModel";

const getModelForType = (type: string) => {
  const modelMap = {
    wouldyourather: wyrModel,
    whatwouldyoudo: wwydModel,
    neverhaveiever: nhieModel,
    dare: dareModel,
    truth: truthModel,
    topic: topicModel,
  };
  return modelMap[type as keyof typeof modelMap];
};

type QuestionTypes = 'truth' | 'dare' | 'wouldyourather' | 'neverhaveiever' | 'whatwouldyoudo' | 'topic';

const isQuestionEnabled = (questionId: string, type: QuestionTypes, guildDb: IGuildModel) => {
  return !guildDb?.disabledQuestions?.[type]?.questions?.includes(questionId);
};

const getQuestionLanguage = (guildLanguage: string): string => {
  const languageMap: { [key: string]: string } = {
    'en_EN': '',
    'en_US': '',
    'de_DE': 'de',
    'es_ES': 'es',
    'fr_FR': 'fr',
    'it_IT': 'it'
  };
  return languageMap[guildLanguage] || '';
};

const getLocalizedQuestion = (question: IQuestionModel, guildLanguage: string): string => {
  const langCode = getQuestionLanguage(guildLanguage);
  if (!langCode) return question.question;
  return question.translations?.[langCode as keyof typeof question.translations] || question.question;
};

const command: ChatInputCommand = {
  requireGuild: true,
  cooldown: true,
  data: new SlashCommandBuilder()
    .setName("question")
    .setDescription("Search for a question by its content")
    .setDescriptionLocalizations({
      de: "Suche nach einer Frage anhand des Inhalts",
      "es-ES": "Busca una pregunta por su contenido",
      fr: "Rechercher une question par son contenu",
      it: "Cerca una domanda per il suo contenuto",
    })
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("What type of question you want to search for")
        .setDescriptionLocalizations({
          de: "Welche Art von Frage möchtest du suchen",
          "es-ES": "Qué tipo de pregunta quieres buscar",
          fr: "Quel type de question voulez-vous rechercher",
          it: "Che tipo di domanda vuoi cercare",
        })
        .setRequired(true)
        .addChoices(
          { name: "Truth", value: "truth" },
          { name: "Dare", value: "dare" },
          { name: "Would You Rather", value: "wouldyourather" },
          { name: "Never Have I Ever", value: "neverhaveiever" },
          { name: "What Would You Do", value: "whatwouldyoudo" },
          { name: "Topic", value: "topic" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("value")
        .setDescription("Search value of the question")
        .setDescriptionLocalizations({
          de: "Suchwert für die Frage",
          "es-ES": "Valor de búsqueda de la pregunta",
          fr: "Valeur de recherche de la question",
          it: "Valore di ricerca della domanda",
        })
        .setRequired(true)
        .setAutocomplete(true),
    ),

  autocomplete: async (interaction, guildDb) => {
    try {
      const focusedValue = interaction.options.getFocused().toLowerCase();
      const type = interaction.options.getString("type");
      
      if (!type) return;

      const model = getModelForType(type);
      if (!model) return;

      const guildLanguage = guildDb?.language || 'en_EN';
      const langCode = getQuestionLanguage(guildLanguage);

      let searchQuery: any = { question: { $regex: focusedValue, $options: 'i' } };
      
      if (langCode) {
        searchQuery = {
          $or: [
            { question: { $regex: focusedValue, $options: 'i' } },
            { [`translations.${langCode}`]: { $regex: focusedValue, $options: 'i' } }
          ]
        };
      }

      const questions = await model
        .find(searchQuery)
        .limit(25);

      await interaction.respond(
        questions.map((q) => ({
          name: `${isQuestionEnabled(q.id, type as QuestionTypes, guildDb) ? '✅' : '❌'} ${getLocalizedQuestion(q, guildLanguage).slice(0, 97)}`,
          value: q.id,
        })),
      );
    } catch (error) {
      captureException(error);
      await interaction.respond([]);
    }
  },

  execute: async (interaction, client, guildDb) => {
    try {
      const type = interaction.options.getString("type", true);
      const questionId = interaction.options.getString("value", true);

      const model = getModelForType(type);
      if (!model) {
        await interaction.reply({
          content: "Invalid question type selected.",
          ephemeral: true,
        });
        return;
      }

      const question = await model.findOne({ id: questionId });
      
      if (!question) {
        await interaction.reply({
          content: "Question not found.",
          ephemeral: true,
        });
        return;
      }

      const guildLanguage = guildDb?.language || 'en_EN';
      const localizedQuestion = getLocalizedQuestion(question, guildLanguage);

      const typeNames = {
        wouldyourather: "Would You Rather",
        whatwouldyoudo: "What Would You Do",
        neverhaveiever: "Never Have I Ever",
        dare: "Dare",
        truth: "Truth",
        topic: "Topic",
      };

      const status = isQuestionEnabled(questionId, type as QuestionTypes, guildDb) ? '✅ Enabled' : '❌ Disabled';

      const embed = new EmbedBuilder()
        .setTitle(typeNames[type as keyof typeof typeNames] || type)
        .setColor(isQuestionEnabled(questionId, type as QuestionTypes, guildDb) ? "#50C878" : "#FF6B6B")
        .setDescription(localizedQuestion)
        .addFields(
          { name: "Status", value: status, inline: true },
          { name: "ID", value: question.id, inline: true },
          { name: "Type", value: type, inline: true }
        );

      if (localizedQuestion !== question.question) {
        embed.addFields({ 
          name: "Original (English)", 
          value: question.question 
        });
      }

      const otherTranslations = Object.entries(question.translations)
        .filter(([lang, translation]) => translation && getLocalizedQuestion(question, guildLanguage) !== translation)
        .map(([lang, translation]) => `${lang.toUpperCase()}: ${translation}`)
        .join("\n");

      if (otherTranslations) {
        embed.addFields({ 
          name: "Other Translations", 
          value: otherTranslations 
        });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      captureException(error);
      await interaction.reply({
        content: "An error occurred while fetching the question.",
        ephemeral: true,
      });
    }
  },
};

export default command;