import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from 'discord.js';
import { ExtendedClient } from 'src/client';

const modalObject = {
  title: 'Replay Cooldown',
  custom_id: 'replaymodal',
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: 'input',
          label: 'Provide a replay cooldown in milliseconds',
        },
      ],
    },
  ],
};

function isNumericRegex(str: string) {
  return /^[0-9]+$/.test(str);
}

const button: CoreButton = {
  name: 'selectMenuReplay',
  description: 'Select Menu Replay',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    // ! This code was trying to get `values` from a button interaction
    /* if (!interaction.guild) return;

    if (guildDb.replayChannels.find((c) => c.id === interaction.values[0]))
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          'Settings.replayChannelAlready'
        ),
        ephemeral: true,
      });

    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        if (
          modalInteraction.components[0].components[0].type !==
          ComponentType.TextInput
        )
          return;
        if (!modalInteraction.isFromMessage()) return;

        const stringValue = modalInteraction.components[0].components[0].value;

        if (isNumericRegex(stringValue) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.cooldownInvalid'
            ),
          });

        const value = parseInt(stringValue);

        if (value < 2000)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.cooldownMin'
            ),
          });

        if (value > 21600000)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.cooldownTooLong'
            ),
          });

        const arr =
          guildDb.replayChannels.length > 0
            ? [{ id: interaction.values[0], cooldown: value }].concat(
                guildDb.replayChannels
              )
            : [{ id: interaction.values[0], cooldown: value }];

        const generalMsg = new EmbedBuilder()
          .setTitle(
            client.translation.get(
              guildDb?.language,
              'Settings.embed.generalTitle'
            )
          )
          .setDescription(
            `${client.translation.get(
              guildDb?.language,
              'Settings.embed.replayType'
            )}: ${guildDb.replayType}\n ${client.translation.get(
              guildDb?.language,
              'Settings.embed.replayChannels'
            )}:\n${arr.map((c) => `<#${c.id}>: ${c.cooldown}`).join('\n')}`
          )
          .setColor(config.colors.primary)
          .setFooter({
            text: client.translation.get(
              guildDb?.language,
              'Settings.embed.footer'
            ),
            iconURL: client.user?.avatarURL() || undefined,
          });

        const generalButtons =
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('replayChannels')
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  'Settings.button.replayCooldown'
                )
              )
              .setStyle(
                guildDb.replayCooldown
                  ? ButtonStyle.Success
                  : ButtonStyle.Secondary
              ),
            new ButtonBuilder()
              .setCustomId('replayType')
              .setLabel(
                client.translation.get(
                  guildDb?.language,
                  'Settings.button.replayType'
                )
              )
              .setStyle(ButtonStyle.Primary)
              .setEmoji('📝')
          );

        const chanDelete = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('replayDeleteChannels')
            .setLabel(
              client.translation.get(
                guildDb?.language,
                'Settings.button.replayDeleteChannels'
              )
            )
            .setStyle(ButtonStyle.Danger)
        );

        const channel = client.channels.cache.get(interaction.values[0]);
        if (!channel) return;

        guildDb.replayChannels.push({
          id: interaction.values[0],
          cooldown: value,
          name: channel.name.slice(0, 25),
        });
        await client.database.updateGuild(interaction.guild.id, {
          replayChannels: guildDb.replayChannels,
        });

        return modalInteraction.update({
          content: '',
          embeds: [generalMsg],
          components: [generalButtons, chanDelete],
        });
      })
      .catch((e) => {
        console.log(e);
      }); */
  },
};

export default button;
