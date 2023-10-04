const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const Sentry = require("@sentry/node");
const modalObject = {
  title: "Daily Message Timezone",
  custom_id: "modal",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a timezone",
        },
      ],
    },
  ],
};

function isValid(tz) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return false;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (err) {
    Sentry.captureException(err);
    return false;
  }
}

function dateType(tz) {
  if (!tz.includes("/")) return false;
  let text = tz.split("/");

  if (text.length === 2) return true;
  else return false;
}

module.exports = {
  data: {
    name: "dailyTimezone",
    description: "Daily Message Toggle",
  },
  async execute(interaction, client, guildDb) {
    await interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.dailyTimezone.toLowerCase() === value.toLowerCase())
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.errorSame",
            ),
          });
        if (!isValid(value))
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.errorInvalid",
            ),
          });
        if (!dateType(value))
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.errorInvalid",
            ),
          });

        const dailyMsgs = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyTitle",
            ),
          )
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyMsg",
            )}: ${
              guildDb.dailyMsg
                ? `<:check:1077962440815411241>`
                : `<:x_:1077962443013238814>`
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyChannel",
            )}: ${
              guildDb.dailyChannel
                ? `<#${guildDb.dailyChannel}>`
                : `<:x_:1077962443013238814>`
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyRole",
            )}: ${
              guildDb.dailyRole
                ? `<@&${guildDb.dailyRole}>`
                : `<:x_:1077962443013238814>`
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyTimezone",
            )}: ${value}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyInterval",
            )}: ${guildDb.dailyInterval}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyType",
            )}: ${guildDb.customTypes}` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyThread",
              )}: ${
                guildDb.dailyThread
                  ? `<:check:1077962440815411241>`
                  : `<:x_:1077962443013238814>`
              }`,
          )
          .setColor("#0598F6");

        const dailyButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("dailyMsg")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyMsg",
                ),
              )
              .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
            new ButtonBuilder()
              .setCustomId("dailyChannel")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyChannel",
                ),
              )
              .setStyle(guildDb.dailyChannel ? "Success" : "Secondary"),
            new ButtonBuilder()
              .setCustomId("dailyType")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyType",
                ),
              )
              .setStyle("Primary")
              .setEmoji("📝"),
          ),
          dailyButtons2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("dailyTimezone")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyTimezone",
                ),
              )
              .setStyle("Primary")
              .setEmoji("🌍"),
            new ButtonBuilder()
              .setCustomId("dailyRole")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyRole",
                ),
              )
              .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
            new ButtonBuilder()
              .setCustomId("dailyInterval")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyInterval",
                ),
              )
              .setStyle("Primary")
              .setEmoji("⏰"),
          ),
          dailyButtons3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("dailyThread")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyThread",
                ),
              )
              .setStyle(guildDb.dailyThread ? "Success" : "Secondary"),
          );

        await client.database.updateGuild(interaction.guild.id, {
          dailyTimezone: value,
        });

        return modalInteraction.update({
          content: null,
          embeds: [dailyMsgs],
          components: [dailyButtons, dailyButtons2, dailyButtons3],
          ephemeral: true,
        });
      });
  },
};
