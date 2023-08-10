const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: {
    name: "neverhaveiever",
    description: "never have i ever",
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
    const { Funny, Basic, Young, Food, RuleBreak } =
      await require(`../data/nhie-${guildDb.language}.json`);
    const neverArray = [...Funny, ...Basic, ...Young, ...Food, ...RuleBreak];
    const randomNever = Math.floor(Math.random() * neverArray.length);

    let ratherembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`,
        iconURL: interaction.user.avatarURL(),
      })
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomNever}`,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(neverArray[randomNever]);

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
        embeds: [ratherembed],
        components: [row, mainRow],
      })
      .catch((err) => {
        return console.log(err);
      });
  },
};
