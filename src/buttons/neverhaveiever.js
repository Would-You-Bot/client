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
    name: "neverhaveiever",
    description: "never have I ever",
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
    const { Funny, Basic, Young, Food, RuleBreak } = await require(
      `../data/nhie-${guildDb.language}.json`,
    );
    const dbquestions = guildDb.customMessages.filter(
      (c) => c.type !== "nsfw" && c.type === "neverhaveiever",
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
          ...dbquestions.map((c) => c.msg),
        ]);
        break;
      case "custom":
        nererhaveIever = shuffle(dbquestions.map((c) => c.msg));
        break;
    }
    const Random = Math.floor(Math.random() * nererhaveIever.length);

    let nhiembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${Random}`,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(nererhaveIever[Random]);

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
        .setCustomId(`neverhaveiever`),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const { row, id } = await client.voting.generateVoting(
      interaction.guildId,
      interaction.channelId,
      time < three_minutes ? 0 : ~~((Date.now() + time) / 1000),
      1,
    );

    return interaction
      .reply({
        embeds: [nhiembed],
        components: [row, mainRow],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
