import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
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
  return /^[0-9]+$/.test(str); // regex for extra 0,00000002% speeds :trol:
}

const button: CoreButton = {
  name: 'replayCooldown',
  description: 'Daily Message Toggle',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction) => {
        if (!modalInteraction.isFromMessage()) return;
        if (!interaction.guild) return;
        if (
          modalInteraction.components[0].components[0].type !==
          ComponentType.TextInput
        )
          return;
        const value = modalInteraction.components[0].components[0].value;
        if (Number.isNaN(parseInt(value, 10))) return;

        if (isNumericRegex(value) === false)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.cooldownInvalid'
            ),
          });

        if (guildDb.replayCooldown.toString() === value)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.replaySame'
            ),
          });

        if (parseInt(value, 10) < 2000)
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              'Settings.cooldownMin'
            ),
          });

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
            )}: ${guildDb.replayType}\n${client.translation.get(
              guildDb?.language,
              'Settings.embed.replayCooldown'
            )}: ${
              guildDb.replayCooldown ? `${value}` : config.emojis.close.full
            }\n`
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
              .setCustomId('replayCooldown')
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

        await client.database.updateGuild(interaction.guild.id, {
          replayCooldown: value,
        });

        return modalInteraction.update({
          content: null,
          embeds: [generalMsg],
          components: [generalButtons],
        });
      });
  },
};

export default button;
