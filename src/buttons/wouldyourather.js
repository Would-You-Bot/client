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
    name: "wouldyourather",
    description: "would you rather",
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

    const { General } = await require(
      `../data/rather-${guildDb.language}.json`,
    );
    const dbquestions = guildDb.customMessages.filter(
      (c) => c.type !== "nsfw" && c.type === "wouldyourather",
    );

    let wouldyourather = [];

    if (!dbquestions.length) guildDb.customTypes = "regular";

    switch (guildDb.customTypes) {
      case "regular":
        wouldyourather = shuffle([...General]);
        break;
      case "mixed":
        wouldyourather = shuffle([
          ...General,
          ...dbquestions.map((c) => c.msg),
        ]);
        break;
      case "custom":
        wouldyourather = shuffle(dbquestions.map((c) => c.msg));
        break;
    }

    const Random = Math.floor(Math.random() * wouldyourather.length);

    let ratherembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: General | ID: ${Random}`,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(wouldyourather[Random]);

    if (!guildDb.replay)
      return interaction.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Rather.replays.disabled",
        ),
      });

    const mainRow = new ActionRowBuilder();
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
        .setCustomId(`wouldyourather`)
        .setDisabled(!guildDb.replay),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId,
      interaction.channelId,
      time < three_minutes ? 0 : ~~((Date.now() + time) / 1000),
      0,
    );

    return interaction
      .reply({
        embeds: [ratherembed],
        components: [row, mainRow],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
