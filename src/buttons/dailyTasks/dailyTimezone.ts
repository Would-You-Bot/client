import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Button} from "../../interfaces";

const modalObject = {
  title: "Daily Message Timezone",
  custom_id: "dailyTimezone",
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

function isValid(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return false;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (err) {
    return false;
  }
}

function dateType(tz: string) {
  if (!tz.includes("/")) return false;
  let text = tz.split("/");

  if (text.length === 2) return true;
  else return false;
}

const button: Button = {
  name: "dailyTimezone",
  execute: async (interaction, client, guildDb) => {
    await interaction.showModal(modalObject);

    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 6000000,
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
              guildDb.dailyMsg ? ":white_check_mark:" : ":x:"
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyChannel",
            )}: ${
              guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : ":x:"
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyRole",
            )}: ${
              guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : ":x:"
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyTimezone",
            )}: ${value}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyInterval",
            )}: ${guildDb.dailyInterval}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.dailyType",
            )}: ${guildDb.customTypes}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyThread",
              )}: ${guildDb.dailyThread ? ":white_check_mark:" : ":x:"}`,
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
              .setStyle(
                guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary,
              ),
            new ButtonBuilder()
              .setCustomId("dailyChannel")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyChannel",
                ),
              )
              .setStyle(
                guildDb.dailyChannel
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary,
              ),
            new ButtonBuilder()
              .setCustomId("dailyType")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyType",
                ),
              )
              .setStyle(ButtonStyle.Primary)
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
              .setStyle(ButtonStyle.Primary)
              .setEmoji("🌍"),
            new ButtonBuilder()
              .setCustomId("dailyRole")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyRole",
                ),
              )
              .setStyle(
                guildDb.dailyRole ? ButtonStyle.Success : ButtonStyle.Secondary,
              ),
            new ButtonBuilder()
              .setCustomId("dailyInterval")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyInterval",
                ),
              )
              .setStyle(ButtonStyle.Primary)
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
              .setStyle(
                guildDb.dailyThread
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary,
              ),
          );

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          dailyTimezone: value,
        });

        (modalInteraction as any).update({
          content: null,
          embeds: [dailyMsgs],
          components: [dailyButtons, dailyButtons2, dailyButtons3],
          ephemeral: true,
        });
        return;
      });
  },
};

export default button;
