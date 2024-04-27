import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";
const modalObject = {
  title: "Replay Cooldown",
  custom_id: "replayCooldown",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a replay cooldown in milliseconds",
        },
      ],
    },
  ],
};

function isNumericRegex(str: string) {
  return /^[0-9]+$/.test(str); // regex for extra 0,00000002% speeds :trol:
}

const button: Button = {
  name: "replayCooldown",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    await interaction.showModal(modalObject);

    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 6000000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.replayCooldown.toString() === value)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.replaySame",
            ),
          });

        if (isNumericRegex(value) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownInvalid",
            ),
          });

        const generalMsg = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              "Settings.embed.generalTitle",
            ),
          )
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayType",
            )}: ${guildDb.replayType}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayBy",
            )}: ${guildDb.replayBy}\n${
              guildDb.replayBy === "Guild"
                ? client.translation.get(
                    guildDb?.language,
                    "Settings.embed.replayBy2",
                  )
                : client.translation.get(
                    guildDb?.language,
                    "Settings.embed.replayBy1",
                  )
            }\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayCooldown",
            )}: ${
              guildDb.replayCooldown
                ? `${Math.min(Number(value), 86400000)}`
                : ":x:"
            }\n`,
          )
          .setColor("#0598F6")
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              "Settings.embed.footer",
            ),
            iconURL: client?.user?.displayAvatarURL() || undefined,
          });

        const generalButtons =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("replayType")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.replayType",
                ),
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji("1207774450658050069"),
            new ButtonBuilder()
              .setCustomId("replayBy")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.replayBy",
                ),
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji("1207778786976989244"),
          );

        const setDeleteButtons =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("replayCooldown")
              .setEmoji("1185973661736374405")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.replayCooldown",
                ),
              )
              .setStyle(
                guildDb.replayCooldown
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary,
              ),
          );

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          replayCooldown: Math.min(Number(value), 86400000),
        });

        (modalInteraction as any).update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons, setDeleteButtons],
          ephemeral: true,
        });
        return;
      });
  },
};

export default button;
