import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const modalObject = {
  title: "Custom Username",
  custom_id: "webhookNameModal",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a username for QOTD webhooks.",
          placeholder: "This username will be used for QOTD webhooks.",
          max_length: 32,
          min_length: 3,
          required: true,
        },
      ],
    },
  ],
};

const button: Button = {
  name: "webhookName",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    if (!guildDb.premium) {
      interaction.reply({
        content: client.translation.get(guildDb?.language, "Settings.premium"),
        ephemeral: true,
      });
      return;
    }

    await interaction.showModal(modalObject);

    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 600000,
      })
      .then(async (modalInteraction) => {
        let value = modalInteraction.components[0].components[0].value as any;
        let filter = [
          "Discord",
          "discord",
          "Everyone",
          "everyone",
          "clyde",
          "Clyde",
        ];
        for (let i = 0; filter.length > i; i++) {
          if (value.includes(filter[i]))
            return modalInteraction.reply({
              content: client.translation.get(
                guildDb?.language,
                "Settings.filter",
              ),
              ephemeral: true,
            });
        }

        const emb = new EmbedBuilder()
          .setTitle("Would You - Utility")
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              "Settings.embed.username",
            )}: ${value}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.avatar",
            )}: ${guildDb.webhookAvatar ? `[Image](<${guildDb.webhookAvatar}>)` : `:x:`}\n${client.translation.get(
              guildDb?.language,
              "Settings.embed.classicMode",
            )}: ${guildDb.classicMode ? ":white_check_mark:" : ":x:"}`,
          )
          .setColor("#0598F6")
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              "Settings.embed.footer",
            ),
            iconURL: client?.user?.displayAvatarURL() || undefined,
          });

        const button =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("webhookName")
              .setEmoji("1185973660465500180")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.name",
                ),
              )
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("webhookAvatar")
              .setEmoji("1207801424503644260")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.avatar",
                ),
              )
              .setStyle(
                guildDb.webhookAvatar
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary,
              ),
          );

        const button2 =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("classicMode")
              .setEmoji("1256977616242606091")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.classicMode",
                ),
              )
              .setStyle(
                guildDb.classicMode
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary,
              ),
          );

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          webhookName: value,
        });

        await (modalInteraction as any).update({
          embeds: [emb],
          components: [button, button2],
          options: {
            ephemeral: true,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        captureException(err);
      });
  },
};

export default button;
