import {
  EmbedBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Button } from "../models";

const button: Button = {
  name: "viewCommands",
  execute: async (interaction, client, guildDb) => {
    const languageMappings = {
      de_DE: "de",
      en_EN: "en",
      es_ES: "es",
      fr_FR: "fr",
    } as any;

    const commands = await client.application?.commands.fetch({
      withLocalizations: true,
    });
    const type = languageMappings[guildDb?.language] || "en";

    const helpembed = new EmbedBuilder().setColor("#2b2d31").setDescription(
      (commands as any)
        .filter((e: any) => e.name !== "reload")
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map(
          (n: any) =>
            `</${n.name}:${n.id}> - ${
              type === "de"
                ? n.descriptionLocalizations.de
                : type === "es"
                  ? n.descriptionLocalizations["es-ES"]
                  : type === "fr"
                    ? n.descriptionLocalizations.fr
                    : n.description
            }`,
        )
        .join("\n"),
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
          .setLabel("View Help")
          .setCustomId("viewHelp")
          .setStyle(2)
          .setEmoji("⬅️"),
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
