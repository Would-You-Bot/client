import {
  EmbedBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Button } from "../../interfaces";

const button: Button = {
  name: "viewHelp",
  execute: async (interaction, client, guildDb) => {

    const commands = await client.application?.commands.fetch({
      withLocalizations: false,
    });

    const getCommandByName = (name: string) => {
      return commands?.find((command) => command.name === name)?.id;
    };

    const helpembed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setDescription(
        `## What is Would You? \n\n **Would You** is a bot that allows you to play the game 'Would You Rather' with your friends on Discord. \n## Main Game Modes \n The game modes of  <:roundyou:1009964111045607525> **Would You** include </wouldyourather:${getCommandByName("wouldyourather")}>, </neverhaveiever:${getCommandByName("neverhaveiever")}>, </whatwouldyoudo:${getCommandByName("whatwouldyoudo")}>, </higherlower:${getCommandByName("higherlower")}> and last but not least there is </truth:${getCommandByName("truth")}> or </dare:${getCommandByName("dare")}>! \n## Configure the bot \n You can use the </settings cooldowns:${getCommandByName("settings")}> commands to modify button cooldowns, enable and disable the question of the day feature or the welcomer. \n## Privacy \n If you dont want to show up on leaderboards or votes. You can adjust your privacy settings using </privacy:${getCommandByName("privacy")}>. To find out what data we store visit our [Privacy Policy](https://wouldyoubot.gg/privacy)`,
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
