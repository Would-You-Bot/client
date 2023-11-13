import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../models";
const modalObject = {
  title: "Replay Cooldown",
  custom_id: "replaymodal",
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
  execute: async (interaction, client, guildDb) => {
    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
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
            }\n\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayType",
            )}: ${guildDb.replayType}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayCooldown",
            )}: ${
              guildDb.replayCooldown ? `${value}` : `<:x_:1077962443013238814>`
            }\n`,
          )
          .setColor("#0598F6")
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              "Settings.embed.footer",
            ),
            iconURL: client.user?.avatarURL() || undefined,
          });

        const generalButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("replayCooldown")
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
          new ButtonBuilder()
            .setCustomId("replayType")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayType",
              ),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📝"),
          new ButtonBuilder()
            .setCustomId("replayBy")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayBy",
              ),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📝"),
        );

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          replayCooldown: Number(value),
        });

        (modalInteraction as any).update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons],
          ephemeral: true,
        });
        return;
      });
  },
};

export default button;
