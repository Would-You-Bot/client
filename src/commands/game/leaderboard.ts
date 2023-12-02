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
        try {
          const page = new Paginator({
            user: interaction.user.id,
            client,
            timeout: 180000,
          });

          let data2 = await UserModel.find({
            "higherlower.highscore": { $gt: 1 },
          }).sort({ "higherlower.highscore": -1 });

          (async function loop(z) {
            let users: {
              top: number;
              tag: string;
              score: number;
              id: string;
              avatar: string;
            }[] = [];
            for (let i = 0; i < 10; i++) {
              z++;

              let data: any = data2[z];
              let user = await client.users.fetch(data.userID);

              users.push({
                top: z,
                avatar:
                  user.displayAvatarURL() ||
                  "https://cdn.discordapp.com/embed/avatars/0.png",
                tag: user.username,
                id: user.id,
                score: data.higherlower.highscore,
              });

              if (z === 9) {
                if (!users.find((a: any) => a.id === interaction.user.id)) {
                  let interactData = data2.find(
                    (e: any) => e.userID === interaction.user.id,
                  );
                  users.push({
                    top: data2.findIndex(
                      (e) =>
                        e.higherlower.highscore ===
                        interactData?.higherlower.highscore,
                    ),
                    avatar: interaction.user.displayAvatarURL(),
                    tag: interaction.user.username,
                    id: interaction.user.id,
                    score: interactData?.higherlower.highscore as number,
                  });
                } else {
                  z++;

                  let data: any = data2[z];
                  let user = await client.users.fetch(data.userID);

                  users.push({
                    top: z,
                    avatar:
                      user.displayAvatarURL() ||
                      "https://cdn.discordapp.com/embed/avatars/0.png",
                    tag: user.username,
                    id: user.id,
                    score: data.higherlower.highscore,
                  });
                }

                const leaderboard = new Leaderboard()
                  .setOpacity(0.7)
                  .setScoreMessage("Highest Score:")
                  .addBachground(
                    "image",
                    "https://i.imgur.com/h3b4KZI_d.webp?maxwidth=760&fidelity=grand",
                  )
                  .setColors({
                    box: "#212121",
                    username: "#ffffff",
                    score: "#ffffff",
                    firstRank: "#FFD700",
                    secondRank: "#C0C0C0",
                    thirdRank: "#CD7F32",
                  })
                  .addUserData(users);

                const imageBuffer = await leaderboard.build();

                const image = new AttachmentBuilder(imageBuffer, {
                  name: "leaderboard.png",
                });

                page.add(
                  new EmbedBuilder()
                    .setTitle(`Leaderboard`)
                    .setImage("attachment://leaderboard.png")
                    .setColor("#F00605"),
                  image,
                );

                return page.start(interaction, null);
              }

              // if (z === 9) {
              //   return page.start(interaction, null);
              // }
            }
            setTimeout(function () {
              users = [];
              loop(z);
            }, 500);
          })(0);
        } catch (e) {
          console.log(e);
        }
        // data2 = data2.map((e: any) =>
        //   page.add(
        //     new EmbedBuilder()
        //       .setTitle(`Voted for Option 2`)
        //       .setDescription(e.slice(0, 10).join("\n").toString())
        //       .setColor("#F00605"),
        //     null,
        //   ),
        // );

        // leaderboard.build().then((img: any) => {
        //   write("./src/data/Images/leaderboard.png", img);
        // });

        // const a = new AttachmentBuilder("./src/data/Images/leaderboard.png");
        // const e = new EmbedBuilder()
        //   .setColor("#0598F6")
        //   .setImage("attachment://leaderboard.png");
        // interaction.reply({ embeds: [e], files: [a] });

        break;
    }
  },
};

export default command;
