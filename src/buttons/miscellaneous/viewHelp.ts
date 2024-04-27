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
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const commands = await client.application?.commands.fetch({
      withLocalizations: false,
    });

    const getCommandByName = (name: string) => {
      return commands?.find((command) => command.name === name)?.id;
    };

    const helpembed = new EmbedBuilder().setColor("#2b2d31").setDescription(
      client.translation.get(guildDb?.language, "Help.embed.description", {
        wouldyourather: getCommandByName("wouldyourather"),
        neverhaveiever: getCommandByName("neverhaveiever"),
        whatwouldyoudo: getCommandByName("whatwouldyoudo"),
        higherlower: getCommandByName("higherlower"),
        truth: getCommandByName("truth"),
        dare: getCommandByName("dare"),
        privacy: getCommandByName("privacy"),
      }),
    );

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(
            client.translation.get(guildDb?.language, "Help.button.discord"),
          )
          .setStyle(5)
          .setEmoji("💫")
          .setURL("https://discord.gg/vMyXAxEznS"),
        new ButtonBuilder()
          .setLabel(
            client.translation.get(guildDb?.language, "Help.button.invite"),
          )
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
        new ButtonBuilder()
          .setLabel(
            client.translation.get(guildDb?.language, "Help.button.commands"),
          )
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
