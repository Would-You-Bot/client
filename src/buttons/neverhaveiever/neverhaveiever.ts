import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  MessageActionRowComponentBuilder,
} from "discord.js";
import Sentry from "@sentry/node";
import shuffle from "../../util/shuffle";
import { Button } from "../../models";
import path from "path";

const button: Button = {
  name: "neverhaveiever",
  execute: async (interaction, client, guildDb) => {
    if (
      !(interaction.channel as any)
        .permissionsFor(interaction.user.id)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      interaction.reply({
        content:
          "You don't have permission to use this button in this channel!",
        ephemeral: true,
      });
      return;
    }
    var Funny = null as any;
    var Basic = null as any;
    var Young = null as any;
    var Food = null as any;
    var RuleBreak = null as any;

    await import(
      path.join(__dirname, "..", "..", "data", `nhie-${guildDb.language}.json`)
    ).then((value: any) => {
      Funny = value.Funny;
      Basic = value.Basic;
      Young = value.Young;
      Food = value.Food;
      RuleBreak = value.RuleBreak;
    });

    const dbquestions = guildDb.customMessages.filter(
      (c: any) => c.type !== "nsfw" && c.type === "neverhaveiever",
    );

    let nererhaveIever = [];

    if (!dbquestions.length) guildDb.customTypes = "regular";

    switch (guildDb.customTypes) {
      case "regular":
        nererhaveIever = shuffle([
          ...Funny,
          ...Basic,
          ...Young,
          ...Food,
          ...RuleBreak,
        ]);
        break;
      case "mixed":
        nererhaveIever = shuffle([
          ...Funny,
          ...Basic,
          ...Young,
          ...Food,
          ...RuleBreak,
          ...dbquestions.map((c: any) => c.msg),
        ]);
        break;
      case "custom":
        nererhaveIever = shuffle(dbquestions.map((c: any) => c.msg));
        break;
    }
    const Random = Math.floor(Math.random() * nererhaveIever.length);

    let nhiembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${Random}`,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setDescription(nererhaveIever[Random]);

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
        .setCustomId(`neverhaveiever`),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId,
      interaction.channelId,
      time < three_minutes ? 0 : ~~((Date.now() + time) / 1000),
      "neverhaveiever",
    );

    interaction
      .reply({
        embeds: [nhiembed],
        components: [row as any, mainRow],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
    return;
  },
};

export default button;
