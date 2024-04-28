import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { captureException } from "@sentry/node";
import { Button } from "../../interfaces";

const modalObject = {
  title: "Replay Cooldown",
  custom_id: "selectMenuReplay",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a replay cooldown in seconds",
        },
      ],
    },
  ],
};

function isNumericRegex(str: string) {
  return /^\d*\.?\d+$/.test(str); // regex for extra 0,00000002% speeds :trol:
}

const button: Button = {
  name: "selectMenuReplay",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    await interaction.showModal(modalObject);

    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 600000,
      })
      .then(async (modalInteraction) => {
        let value = modalInteraction.components[0].components[0].value as any;
        if (isNumericRegex(value) === false) {
          modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownInvalid",
            ),
          });
          return;
        }

        if (Number(value) < 2) {
          modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.replayCooldownMin",
            ),
          });
          return;
        }

        if (Number(value) > 21600) {
          modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownTooLong",
            ),
          });
          return;
        }

        if (
          guildDb.replayChannels.find(
            (e: any) => e.id === (interaction as any).values[0],
          )
        ) {
          guildDb.replayChannels = guildDb.replayChannels.filter(
            (c) => c.id !== (interaction as any).values[0],
          );
        }

        value = value * 1000;
        const arr =
          guildDb.replayChannels.length > 0
            ? [
                {
                  id: (interaction as any).values[0],
                  cooldown: value,
                },
              ].concat(guildDb.replayChannels)
            : [
                {
                  id: (interaction as any).values[0],
                  cooldown: value,
                },
              ];

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
              "Settings.embed.replayChannels",
            )}:\n${arr.sort((a, b) => (b.cooldown / 1000) - (a.cooldown / 1000)).map((c) => `<#${c.id}>: ${c.cooldown / 1000}s`).join("\n")}`,
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
              .setCustomId("replayChannels")
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
            new ButtonBuilder()
              .setCustomId("replayDeleteChannels")
              .setEmoji("1207774452230787182")
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  "Settings.button.replayDeleteChannels",
                ),
              )
              .setStyle(ButtonStyle.Danger),
          );

        const channel = client.channels.cache.get(
          (interaction as any).values[0],
        );

        guildDb.replayChannels.push({
          id: (interaction as any).values[0],
          cooldown: value,
          name: (channel as any)?.name.slice(0, 25),
        });

        await client.database.updateGuild(interaction.guild?.id || "", {
          ...guildDb,
          replayChannels: guildDb.replayChannels,
        });
        (modalInteraction as any).update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons, setDeleteButtons],
          ephemeral: true,
        });
        return;
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default button;
