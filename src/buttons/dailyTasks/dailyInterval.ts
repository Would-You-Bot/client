import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const modalObject = {
  title: "Daily Post Time",
  custom_id: "dailyInterval",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "When should the message be posted? (HH:MM)",
        },
      ],
    },
  ],
};

function isFormat(str: string) {
  return /^(?:[01]\d|2[0-4]):(?:00|05|10|15|20|25|30|35|40|45|50|55)$/.test(
    str,
  );
}

const button: Button = {
  name: "dailyInterval",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const newModalObject = JSON.parse(JSON.stringify(modalObject));
    newModalObject.components[0].components[0].placeholder =
      guildDb.dailyInterval;

    await interaction.showModal(newModalObject);

    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 6000000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.dailyInterval === value)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.intervalSame",
            ),
          });
        if (isFormat(value) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.intervalInvalid",
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
              "Settings.embed.dailyChannel",
            )}: ${
              guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : ":x:"
            }\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyRole",
              )}: ${guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : ":x:"}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyType",
              )}: ${guildDb?.customTypes}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyTimezone",
              )}: ${guildDb.dailyTimezone}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyInterval",
              )}: ${value}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyThread",
              )}: ${guildDb.dailyThread ? ":white_check_mark:" : ":x:"}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.autoPin",
              )}: ${guildDb.autoPin ? ":white_check_mark:" : ":x:"}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyMsg",
              )}: ${guildDb.dailyMsg ? ":white_check_mark:" : ":x:"}`,
          )

          .setColor("#0598F6");
        const dailyButtons =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("dailyChannel")
                .setEmoji("1185973667973320775")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.dailyChannel",
                  ),
                )
                .setStyle(
                  guildDb.dailyChannel
                    ? ButtonStyle.Primary
                    : ButtonStyle.Secondary,
                ),
              new ButtonBuilder()
                .setCustomId("dailyRole")
                .setEmoji("1185973666811478117")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.dailyRole",
                  ),
                )
                .setStyle(
                  guildDb.dailyRole
                    ? ButtonStyle.Primary
                    : ButtonStyle.Secondary,
                ),
              new ButtonBuilder()
                .setCustomId("dailyType")
                .setEmoji("1185973664538177557")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.dailyType",
                  ),
                )
                .setStyle(ButtonStyle.Primary),
            ),
          dailyButtons2 =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("dailyTimezone")
                .setEmoji("1185973663674150912")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.dailyTimezone",
                  ),
                )
                .setStyle(
                  guildDb.dailyTimezone
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary,
                ),
              new ButtonBuilder()
                .setCustomId("dailyInterval")
                .setEmoji("1185973661736374405")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.dailyInterval",
                  ),
                )
                .setStyle(
                  guildDb.dailyInterval
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary,
                ),
              new ButtonBuilder()
                .setCustomId("daySelection")
                .setEmoji("1220826970133368842")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.daySelect",
                  ),
                )
                .setStyle(ButtonStyle.Success),
            ),
          dailyButtons3 =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("dailyThread")
                .setEmoji("1185973669059633304")
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
              new ButtonBuilder()
                .setCustomId("autoPin")
                .setEmoji("1189521962318450698")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.autoPin",
                  ),
                )
                .setStyle(
                  guildDb.autoPin ? ButtonStyle.Success : ButtonStyle.Secondary,
                ),
              new ButtonBuilder()
                .setCustomId("dailyMsg")
                .setEmoji("1185973660465500180")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.dailyMsg",
                  ),
                )
                .setStyle(
                  guildDb.dailyMsg
                    ? ButtonStyle.Success
                    : ButtonStyle.Secondary,
                ),
            );

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          dailyInterval: value,
        });

        return (modalInteraction as any).update({
          content: null,
          embeds: [dailyMsgs],
          components: [dailyButtons, dailyButtons2, dailyButtons3],
          ephemeral: true,
        });
      });
  },
};

export default button;
