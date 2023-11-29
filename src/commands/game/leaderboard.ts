import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  bold,
} from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../models";
import Paginator from "../../util/pagination";
import { UserModel } from "../../util/Models/userModel";
import Canvas from "canvabase";

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
        .addChoices({ name: "Higher & Ligher", value: "higherlower" })
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
          timeout: 180000,
          client,
          image: null,
        });

        const users = await UserModel.find({
          "higherlower.highscore": { $gt: 1 },
        });

        break;
    }
  },
};

export default command;
