import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import shuffle from "../../util/shuffle";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../models";
import { getWwyd } from "../../util/Functions/jsonImport";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("wwyd")
    .setDescription("What would you do in this situation")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Was würdest du in dieser Situation tun",
      "es-ES": "¿Qué harías en esta situación?",
      fr: "Que feriez-vous dans cette situation",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    var WhatYouDo = await getWwyd(guildDb.language);

    const dbquestions = guildDb.customMessages.filter(
      (c) => c.type !== "nsfw" && c.type === "wwyd",
    );

    let whatwouldyoudo = [];

    if (!dbquestions.length) guildDb.customTypes = "regular";

    switch (guildDb.customTypes) {
      case "regular":
        whatwouldyoudo = shuffle([...WhatYouDo]);
        break;
      case "mixed":
        whatwouldyoudo = shuffle([
          ...WhatYouDo,
          ...dbquestions.map((c) => c.msg),
        ]);
        break;
      case "custom":
        whatwouldyoudo = shuffle(dbquestions.map((c) => c.msg));
        break;
    }

    const Random = Math.floor(Math.random() * whatwouldyoudo.length);

    const wwydembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${Random}`,
        iconURL: interaction.user.avatarURL() || "",
      })
      .setDescription(whatwouldyoudo[Random]);

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      row.addComponents([
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      ]);
    }
    row.addComponents([
      new ButtonBuilder()
        .setLabel("New Question")
        .setStyle(1)
        .setEmoji("1073954835533156402")
        .setCustomId(`wwyd`),
    ]);

    interaction
      .reply({ embeds: [wwydembed], components: [row] })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
