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
          label: "Provide a username for Daily Messages",
          placeholder: "This username will be used for Daily Message webhooks.",
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
        let filter = ["Discord", "discord", "Everyone", "everyone"];
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
            )}: ${guildDb.webhookAvatar ? `[Image](<${guildDb.webhookAvatar}>)` : `:x:`}`,
          )
          .setColor("#0598F6")
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              "Settings.embed.footer",
            ),
            iconURL: client?.user?.displayAvatarURL() || undefined,
          });

        const button2 =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("welcomeType")
              .setEmoji("1185973664538177557")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.dailyType",
                ),
              )
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("welcomeChannel")
              .setEmoji("1185973667973320775")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.welcomeChannel",
                ),
              )
              .setStyle(
                guildDb.welcomeChannel
                  ? ButtonStyle.Primary
                  : ButtonStyle.Secondary,
              ),
            new ButtonBuilder()
              .setCustomId("welcomeTest")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.welcomeTest",
                ),
              )
              .setDisabled(guildDb.welcome ? false : true)
              .setStyle(
                guildDb.welcome ? ButtonStyle.Primary : ButtonStyle.Secondary,
              )
              .setEmoji("1207800685928910909"),
          );

        const button1 =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("welcome")
              .setEmoji("1185973660465500180")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.welcome",
                ),
              )
              .setStyle(
                guildDb.welcome ? ButtonStyle.Success : ButtonStyle.Secondary,
              ),
            new ButtonBuilder()
              .setCustomId("welcomePing")
              .setEmoji("1207801424503644260")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.welcomePing",
                ),
              )
              .setStyle(
                guildDb.welcomePing
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary,
              ),
          );

        const button3 =
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

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          webhookName: value,
        });

        await (modalInteraction as any).update({
          embeds: [emb],
          components: [button1, button2, button3],
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
