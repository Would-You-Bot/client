import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  PermissionFlagsBits,
  bold,
} from "discord.js";
import { Button } from "../../interfaces";
import shuffle from "../../util/shuffle";

import { getNeverHaveIEver } from "../../util/Functions/jsonImport";
import { IUserModel, UserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "neverhaveiever",
  execute: async (interaction: any, client, guildDb) => {
    if (interaction.guild) {
      await interaction.message.edit({
        components: [interaction.message.components[0]],
      });
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
    }

    const userDb = (await UserModel.findOne({
      userID: interaction.user?.id,
    })) as IUserModel;

    let { NeverHaveIever } = await getNeverHaveIEver(
      guildDb?.language != null
        ? guildDb.language
        : userDb?.language
          ? userDb.language
          : "en_EN",
    );

    let dbquestions;

    let nererhaveIever = [] as string[];

    if (guildDb != null) {
      dbquestions = guildDb.customMessages.filter(
        (c) => c.type === "neverhaveiever",
      );

      if (!dbquestions.length) guildDb.customTypes = "regular";

      switch (guildDb.customTypes) {
        case "regular":
          nererhaveIever = shuffle([...NeverHaveIever]);
          break;
        case "mixed":
          nererhaveIever = shuffle([
            ...NeverHaveIever,
            ...dbquestions.map((c) => c.msg),
          ]);
          break;
        case "custom":
          nererhaveIever = shuffle(dbquestions.map((c) => c.msg));
          break;
      }
    } else {
      nererhaveIever = shuffle([...NeverHaveIever]);
    }

    const Random = Math.floor(Math.random() * nererhaveIever.length);

    let nhiembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: NHIE | ID: ${Random}`,
        iconURL: interaction.user.displayAvatarURL() || undefined,
      })
      .setDescription(bold(nererhaveIever[Random]));

    const mainRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setCustomId(`neverhaveiever`)
        .setDisabled(guildDb?.replay != null ? !guildDb.replay : false),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId ? (interaction.guildId as string) : null,
      interaction.channelId,
      time < three_minutes
        ? new Date(0)
        : new Date(~~((Date.now() + time) / 1000)),
      "neverhaveiever",
    );

    interaction
      .reply({
        embeds: [nhiembed],
        components: [row, mainRow],
      })
      .catch((err: Error) => {
        captureException(err);
      });
    return;
  },
};

export default button;
