const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Sentry = require("@sentry/node");
const shuffle = require("../util/shuffle");

module.exports = {
  data: {
    name: "wwyd",
    description: "What would you do",
  },
  async execute(interaction, client, guildDb) {
    if (
      !interaction.channel
        .permissionsFor(interaction.user.id)
        .has(PermissionFlagsBits.SendMessages)
    )
      return interaction.reply({
        content:
          "You don't have permission to use this button in this channel!",
        ephemeral: true,
      });
    const { WhatYouDo } = require(`../data/wwyd-${guildDb.language}.json`);

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
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(whatwouldyoudo[Random]);

    const row = new ActionRowBuilder();
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

    return interaction
      .reply({
        embeds: [wwydembed],
        components: [row],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
