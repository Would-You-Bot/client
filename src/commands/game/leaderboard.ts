const { Leaderboard, write } = require("canvabase");
import {
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../models";
import Paginator from "../../util/pagination";
import { IUserModel, UserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Leaderboard statistics for games")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Test",
      "es-ES": "Test",
      fr: "Test",
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
              .limit(10);

            data = await Promise.all(
              data2.map(async (u: any) => {
                const user = await client.database.getUser(u.userID, true);
                return user?.votePrivacy
                  ? { user: "Anonymous", score: u.higherlower.highscore }
                  : { user: u.userID, score: u.higherlower.highscore };
              }),
            );
            data = data.map(
              (s: any, i = 1) =>
                `${i++}. ${
                  s.user === "Anonymous"
                    ? `${s.user} • **${s.score}** points`
                    : `<@${s.user}> • **${s.score}** points`
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
                  .setTitle(`Global Leaderboard`)
                  .setDescription(e.slice(0, 10).join("\n").toString())
                  .setColor("#0598F6"),
              ),
            );
            break;

          case "local":
            data = await Promise.all(
              guildDb.gameScores.map(async (u: any) => {
                const user = await client.database.getUser(u.userID, true);
                return user?.votePrivacy
                  ? { user: "Anonymous", score: u.higherlower }
                  : { user: u.userID, score: u.higherlower };
              }),
            );
            data = data.map(
              (s: any, i = 1) =>
                `${i++}. ${
                  s.user === "Anonymous"
                    ? `${s.user} • **${s.score}** points`
                    : `<@${s.user}> • **${s.score}** points`
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
                  .setTitle(`Guild Leaderboard`)
                  .setDescription(e.slice(0, 10).join("\n").toString())
                  .setColor("#0598F6"),
              ),
            );
            break;
        }

        page.start(interaction, null);
        break;
    }
  }
};

export default command;
