import {
  EmbedBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Button } from "../models";

const button: Button = {
  name: "viewHelp",
  execute: async (interaction, client, guildDb) => {
    const helpembed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setDescription(
        "## Hello \n\n **Would You** is a bot that allows you to play the game 'Would You Rather' with your friends on Discord. \n\n## Main Game Modes \n\n </wouldyourather:1099463656124723305> \n\n## Privacy \n\n If you dont want to show up on leaderboards or votes. You can adjust your privacy settings using </privacy:1162855843658735716>. To find out what data we store visit our [Privacy Policy](https://wouldyoubot.gg/privacy)",
      );

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Would You Support")
          .setStyle(5)
          .setEmoji("💫")
          .setURL("https://discord.gg/vMyXAxEznS"),
        new ButtonBuilder()
          .setLabel("Would You Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
        new ButtonBuilder()
          .setLabel("View Commands")
          .setCustomId("viewCommands")
          .setStyle(2)
          .setEmoji("➡️"),
      );
    await interaction
      .update({
        embeds: [helpembed],
        components: [button],
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default button;
