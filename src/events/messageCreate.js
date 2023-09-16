const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Sentry = require("@sentry/node");
const Cooldown = new Set();

module.exports = async (client, message) => {
  // Always check the permissions before doing any actions to avoid a ratelimit IP ban =)
  if (
    message?.channel
      ?.permissionsFor(client?.user?.id)
      ?.has([
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
      ])
  ) {
    if (Cooldown.has(message?.channel?.id)) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Hello, my name is Would You.",
        iconURL:
          "https://cdn.discordapp.com/emojis/953349395955470406.gif?size=40&quality=lossless",
      })
      .setDescription(
        `My purpose is to help users have better engagement in your servers to bring up more activity! You can use </help:982400982921138226> to see all of my commands.`,
      )
      .setColor("#0598F6");

    const supportbutton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(5)
        .setEmoji("📋")
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
        ),
      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(5)
        .setEmoji("❤️")
        .setURL("https://discord.gg/vMyXAxEznS"),
    );

    Cooldown.add(message?.channel?.id);
    setTimeout(() => {
      Cooldown.delete(message?.channel?.id);
    }, 10000);

    if (
      message.content &&
      new RegExp(`^(<@!?${client.user.id}>)`).test(message.content)
    )
      return message.channel
        .send({
          embeds: [embed],
          components: [supportbutton],
        })
        .catch((err) => {Sentry.captureException(err);});
  }
};
