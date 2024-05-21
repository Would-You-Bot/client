import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../interfaces";
import Paginator from "../../util/pagination";
import { IUserModel, UserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the top scores for a game")
    .setDMPermission(false)
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
        .addChoices({ name: "Higher or Lower", value: "higherlower" })
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

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const userDb = (await UserModel.findOne({
      userID: interaction.user?.id,
    })) as IUserModel;

    let language =
      guildDb?.language != null
        ? guildDb.language
        : userDb.language
          ? userDb.language
          : "en_EN";

    switch (interaction.options.getString("game")) {
      case "higherlower":
        const page = new Paginator({
          user: interaction.user.id,
          client,
          timeout: 180000,
        });

        let data: any;
        switch (interaction.options.getString("for")) {
          case "global":
            let data2 = await UserModel.find({
              "higherlower.highscore": { $gt: 1 },
            })
              .sort({ "higherlower.highscore": -1 })
              .limit(9);

            data = await Promise.all(
              data2.map(async (u: any) => {
                const user = await client.database.getUser(u.userID, true);
                return user?.votePrivacy
                  ? { user: "Anonymous", score: u.higherlower.highscore }
                  : { user: u.userID, score: u.higherlower.highscore };
              }),
            );

            if (data.length === 0) {
              interaction.reply({
                content: client.translation.get(language, "Leaderboard.none"),
              });
              return;
            }

            data = data.map(
              (s: any, i = 1) =>
                `${i++}. ${
                  s.user === "Anonymous"
                    ? `${s.user} • **${s.score}** ${client.translation.get(
                        language,
                        "Leaderboard.points",
                      )}`
                    : `<@${s.user}> • **${s.score}** ${client.translation.get(
                        language,
                        "Leaderboard.points",
                      )}`
                }`,
            );

            page.add(
              new EmbedBuilder()
                .setTitle(
                  client.translation.get(language, "Leaderboard.global"),
                )
                .setDescription(data.join("\n").toString())
                .setColor("#0598F6"),
            );

            data =
              Math.round(
                (await UserModel.find({
                  "higherlower.highscore": { $gt: 1 },
                }).countDocuments()) / 10,
              ) - 1;

            for (let i = 0; i < data; i++) {
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(language, "Leaderboard.global"),
                  )
                  .setColor("#0598F6"),
              );
            }
            break;

          case "local":
            if (!interaction.guild) {
              interaction.reply({
                ephemeral: true,
                content: `If you would like to check a server's leaderboard, run this in a server you and the bot share!`,
              });
              return;
            }
            data = await Promise.all(
              guildDb.gameScores
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
              });
              return;
            }

            data = data.map(
              (s: any, i = 1) =>
                `${i++}. ${
                  s.user === "Anonymous"
                    ? `${s.user} • **${s.score}** ${client.translation.get(
                        language,
                        "Leaderboard.points",
                      )}`
                    : `<@${s.user}> • **${s.score}** ${client.translation.get(
                        language,
                        "Leaderboard.points",
                      )}`
                }`,
            );
            data = Array.from(
              {
                length: Math.ceil(data.length / 10),
              },
              (a, r) => data.slice(r * 10, r * 10 + 10),
            );

            Math.ceil(data.length / 10);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(language, "Leaderboard.guild"),
                  )
                  .setDescription(e.slice(0, 10).join("\n").toString())
                  .setColor("#0598F6"),
              ),
            );
            break;
        }

        page.start(interaction, "leaderboard");
        break;
    }
  },
};

export default command;
