import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ModalSubmitInteraction,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const modalObject = {
  title: 'Daily Messages Interval',
  custom_id: 'dailyInterval',
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: 'input',
          label: 'Enter a 24 hour dailymsg interval (HH:MM).',
        },
      ],
    },
  ],
};

function isFormat(str: string) {
  return /^(?:[01]\d|2[0-3]):(?:00|30)$/.test(str);
}

const button: CoreButton = {
  name: 'dailyInterval',
  description: 'Daily Interval customization',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (modalInt: ModalSubmitInteraction) =>
          modalInt.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction: ModalSubmitInteraction) => {
        if (!modalInteraction.isFromMessage()) return;
        if (!interaction.guild) return;
        if (
          modalInteraction.components[0].components[0].type !==
          ComponentType.TextInput
        )
          return;
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.dailyInterval === value)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.intervalSame'
            ),
          });
        if (isFormat(value) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.intervalInvalid'
            ),
          });

        const dailyMsgs = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              'Settings.embed.dailyTitle'
            )
          )
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              'Settings.embed.dailyMsg'
            )}: ${
              guildDb.dailyMsg
                ? config.emojis.check.full
                : config.emojis.close.full
            }\n` +
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyChannel'
              )}: ${
                guildDb.dailyChannel
                  ? `<#${guildDb.dailyChannel}>`
                  : config.emojis.close.full
              }\n` +
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyRole'
              )}: ${
                guildDb.dailyRole
                  ? `<@&${guildDb.dailyRole}>`
                  : config.emojis.close.full
              }\n` +
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyTimezone'
              )}: ${guildDb.dailyTimezone}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyInterval'
              )}: ${value}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyType'
              )}: ${guildDb.customTypes}\n` +
              `${client.translation.get(
                guildDb?.language,
                'Settings.embed.dailyThread'
              )}: ${
                guildDb.dailyThread
                  ? config.emojis.check.full
                  : config.emojis.close.full
              }`
          )
          .setColor(config.colors.primary);

        const useButtonStyle = guildDb.dailyMsg
          ? ButtonStyle.Success
          : ButtonStyle.Secondary;

        const dailyButtons =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('dailyMsg')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyMsg'
                  )
                )
                .setStyle(useButtonStyle),
              new ButtonBuilder()
                .setCustomId('dailyChannel')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyChannel'
                  )
                )
                .setStyle(useButtonStyle),
              new ButtonBuilder()
                .setCustomId('dailyType')
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    'Settings.button.dailyType'
                  )
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📝')
            ),
          dailyButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('dailyTimezone')
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  'Settings.button.dailyTimezone'
                )
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji('🌍'),
            new ButtonBuilder()
              .setCustomId('dailyRole')
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  'Settings.button.dailyRole'
                )
              )
              .setStyle(useButtonStyle),
            new ButtonBuilder()
              .setCustomId('dailyInterval')
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  'Settings.button.dailyInterval'
                )
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji('⏰')
          ),
          dailyButtons3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('dailyThread')
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  'Settings.button.dailyThread'
                )
              )
              .setStyle(useButtonStyle)
          );

        await client.database.updateGuild(interaction.guild.id, {
          dailyInterval: value,
        });

        return modalInteraction.update({
          content: '',
          embeds: [dailyMsgs],
          components: [dailyButtons, dailyButtons2, dailyButtons3],
        });
      });
  },
};

export default button;
