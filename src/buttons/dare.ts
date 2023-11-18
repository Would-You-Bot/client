import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  MessageActionRowComponentBuilder,
  bold,
} from "discord.js";
import { captureException } from "@sentry/node";
import shuffle from "../util/shuffle";
import { Button } from "../models";
import { getDare } from "../util/Functions/jsonImport";

const button: Button = {
  name: "dare",
  execute: async (interaction: any, client, guildDb) => {
    if (interaction.channel.isThread()) {
      if (
        !interaction.channel
          ?.permissionsFor(interaction.user.id)
          .has(PermissionFlagsBits.SendMessagesInThreads)
      ) {
        return interaction.reply({
          content:
            "You don't have permission to use this button in this channel!",
          ephemeral: true,
        });
      }
    } else {
      if (
        !interaction.channel
          ?.permissionsFor(interaction.user.id)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          content:
            "You don't have permission to use this button in this channel!",
          ephemeral: true,
        });
      }
    }

    let Dare = await getDare(guildDb.language);
    const dbquestions = guildDb.customMessages.filter(
      (c) => c.type !== "nsfw" && c.type === "dare",
    );

    let truthordare = [] as string[];

    if (!dbquestions.length) guildDb.customTypes = "regular";

    switch (guildDb.customTypes) {
      case "regular":
        truthordare = shuffle([...Dare]);
        break;
      case "mixed":
        truthordare = shuffle([...Dare, ...dbquestions.map((c) => c.msg)]);
        break;
      case "custom":
        truthordare = shuffle(dbquestions.map((c) => c.msg));
        break;
    }

    const Random = Math.floor(Math.random() * truthordare.length);

    const dareembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Dare | ID: ${Random}`,
        iconURL: interaction.user.avatarURL() || "",
      })
      .setDescription(bold(truthordare[Random]));

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    let components = [] as any[];
    if (Math.round(Math.random() * 15) < 3) {
      row2.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
      components = [row, row2];
    } else {
      components = [row];
    }
    row.addComponents([
      new ButtonBuilder().setLabel("Truth").setStyle(3).setCustomId("truth"),
      new ButtonBuilder().setLabel("Dare").setStyle(4).setCustomId("dare"),
      new ButtonBuilder().setLabel("Random").setStyle(1).setCustomId("random"),
    ]);

    interaction
      .reply({ embeds: [dareembed], components: components })
      .catch((err: Error) => {
        captureException(err);
      });
  },
};

export default button;
