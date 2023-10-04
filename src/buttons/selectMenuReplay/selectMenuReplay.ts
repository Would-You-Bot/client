import { ButtonBuilder, ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder, ButtonStyle } from "discord.js";
import Sentry from "@sentry/node";
import { Button } from "../../models";

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
  name: "selectMenuReplay",
  execute: async(interaction, client, guildDb) => {
    if (guildDb.replayChannels.find((c: any) => c.id === (interaction as any).values[0])){
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayChannelAlready",
        ),
        ephemeral: true,
      });
    }

    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        const value = modalInteraction.components[0].components[0].value;
        if (isNumericRegex(value) === false){
          modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownInvalid",
            ),
          });
          return;
        }

        if (Number(value) < 2000){
           modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownMin",
            ),
          });
          return;
        }

        if (Number(value) > 21600000){
          modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Settings.cooldownTooLong",
            ),
          });
          return;
        }

        const arr =
          guildDb.replayChannels.length > 0
            ? [{ id: (interaction as any).values[0], cooldown: value }].concat(
                guildDb.replayChannels,
              )
            : [{ id: (interaction as any).values[0], cooldown: value }];

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
            )}: ${guildDb.replayType}\n ${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayChannels",
            )}:\n${arr.map((c) => `<#${c.id}>: ${c.cooldown}`).join("\n")}`,
          )
          .setColor("#0598F6")
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              "Settings.embed.footer",
            ),
            iconURL: client.user?.avatarURL() || undefined,
          });

        const generalButtons = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("replayChannels")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayCooldown",
              ),
            )
            .setStyle(guildDb.replayCooldown ? ButtonStyle.Success : ButtonStyle.Secondary),
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
        );

        const chanDelete = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("replayDeleteChannels")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.replayDeleteChannels",
              ),
            )
            .setStyle(ButtonStyle.Danger),
        );

        const channel = client.channels.cache.get((interaction as any).values[0]);
        guildDb.replayChannels.push({
          id: (interaction as any).values[0],
          cooldown: value,
          name: (channel as any)?.name.slice(0, 25),
        });
        await client.database.updateGuild(interaction.guild?.id || "", {
          replayChannels: guildDb.replayChannels,
        });
        (modalInteraction as any).update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons, chanDelete],
          ephemeral: true,
        });
        return;
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};

export default button;