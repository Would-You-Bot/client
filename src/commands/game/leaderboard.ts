import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommand } from "../../interfaces";
import { assignRanks } from "../../util/Functions/number";
import { UserModel } from "../../util/Models/userModel";
import Paginator from "../../util/pagination";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the top scores for a game")
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1])
    .setDescriptionLocalizations({
      de: "Zeigt die Rangliste für ein Spiel an",
      "es-ES": "Muestra la lista de clasificación de un partido",
      fr: "Consulter le classement d'un jeu",
      it: "Mostra la classifica di un gioco",
    })
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Which game do you want leaderboards from?")
        .addChoices({
          name: "Higher or Lower",
          value: "higherlower",
        })
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("for")
        .setDescription("Pick what type of leaderboard you want to view")
        .addChoices(
          { name: "Global", value: "global" },
          { name: "Local", value: "local" },
        )
        .setRequired(true),
    ),

  execute: async (interaction, client, guildDb) => {
    const userDb = await UserModel.findOne({
      userID: interaction.user?.id,
    });

    if (!userDb) {
      interaction.reply({
        content: "An error occurred while fetching your data",
        ephemeral: true,
      });
      return;
    }

    const language =
      guildDb?.language != null
        ? guildDb.language
        : userDb.language
          ? userDb.language
          : "en_EN";

    switch (interaction.options.getString("game")) {
      case "higherlower": {
        const page = new Paginator({
          user: interaction.user.id,
          client,
          timeout: 180000,
        });

        let data: any;

        switch (interaction.options.getString("for")) {
          case "global": {
            // Using the index on "higherlower.highscore" to speed up the query
            const data2 = await UserModel.find({
              "higherlower.highscore": { $gt: 1 },
            })
              .sort({ "higherlower.highscore": -1 })
              .limit(10)
              .lean(); // `.lean()` makes the query faster as it skips hydration

            data = await Promise.all(
              data2.map(async (u: any) => {
                const user = await client.database.getUser(u.userID, true);
                return user?.votePrivacy
                  ? {
                      user: "Anonymous",
                      score: u.higherlower.highscore,
                    }
                  : {
                      user: u.userID,
                      score: u.higherlower.highscore,
                    };
              }),
            );

            if (data.length === 0) {
              interaction.reply({
                content: client.translation.get(language, "Leaderboard.none"),
                ephemeral: true,
              });
              return;
            }

            data = assignRanks(data);
            data = data.map(
              (s: typeof data) =>
                `${s.rank}․ ${s.user === "Anonymous" ? s.user : `<@${s.user}>`} • **${s.score}** ${client.translation.get(
                  language,
                  "Leaderboard.points",
                )}`,
            );

            page.add(
              new EmbedBuilder()
                .setTitle(
                  client.translation.get(language, "Leaderboard.global"),
                )
                .setDescription(data.join("\n"))
                .setColor("#0598F6"),
            );

            // Fetch the total count for pagination using the index
            const totalDocs = await UserModel.countDocuments({
              "higherlower.highscore": { $gt: 1 },
            });

            const totalPages = Math.ceil(totalDocs / 10) - 1;

            for (let i = 0; i < totalPages; i++) {
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(language, "Leaderboard.global"),
                  )
                  .setColor("#0598F6"),
              );
            }
            break;
          }

          case "local": {
            if (!interaction.guild) {
              interaction.reply({
                ephemeral: true,
                content: `If you would like to check a server's leaderboard, run this in a server you and the bot share!`,
              });
              return;
            }

            // Use caching and optimize data handling for local scores
            data = await Promise.all(
              guildDb.gameScores
                .filter((u: any) => u.higherlower >= 1)
                .sort((a: any, b: any) => b.higherlower - a.higherlower)
                .map(async (u: any) => {
                  const user = await client.database.getUser(u.userID, true);
                  return user?.votePrivacy
                    ? { user: "Anonymous", score: u.higherlower }
                    : { user: u.userID, score: u.higherlower };
                }),
            );

            if (data.length === 0) {
              interaction.reply({
                content: client.translation.get(language, "Leaderboard.none"),
                ephemeral: true,
              });
              return;
            }

            data = assignRanks(data);
            data = data.map(
              (s: typeof data) =>
                `${s.rank}․ ${s.user === "Anonymous" ? s.user : `<@${s.user}>`} • **${s.score}** ${client.translation.get(
                  language,
                  "Leaderboard.points",
                )}`,
            );

            const paginatedData = Array.from(
              {
                length: Math.ceil(data.length / 10),
              },
              (_a, r) => data.slice(r * 10, r * 10 + 10),
            );

            for (let i = 0; i < paginatedData.length; i++) {
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(language, "Leaderboard.guild"),
                  )
                  .setDescription(paginatedData[i].join("\n"))
                  .setColor("#0598F6"),
              );
            }
            break;
          }
        }

        page.start(
          interaction,
          "leaderboard",
          interaction.options.getString("for"),
        );
        break;
      }
    }
  },
};

export default command;
