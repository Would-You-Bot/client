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
import { GuildProfileDocument } from '@models/GuildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const modalObject = {
  title: 'Daily Message Timezone',
  custom_id: 'modal',
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: 'input',
          label: 'Provide a timezone',
        },
      ],
    },
  ],
};

/**
 * @param timezone
 */
function isValid(timezone: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return false;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (ex) {
    return false;
  }
}

/**
 * @param timezone
 */
function dateType(timezone: string) {
  if (!timezone.includes('/')) return false;
  const text = timezone.split('/');

  if (text.length === 2) return true;
  else return false;
}

const button: CoreButton = {
  name: 'dailyTimezone',
  description: 'Daily Message Toggle',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    interaction.showModal(modalObject);
    interaction
      .awaitModalSubmit({
        /**
         * @param mInter
         */
        filter: (mInter) => mInter.customId === modalObject.custom_id,
        time: 60000,
      })
      .then(async (modalInteraction: ModalSubmitInteraction) => {
        if (!interaction.guild) return;
        if (!modalInteraction.isFromMessage()) return;
        if (modalInteraction.components[0].components[0].type !== ComponentType.TextInput) return;
        const value = modalInteraction.components[0].components[0].value;

        if (guildDb.dailyTimezone.toLowerCase() === value.toLowerCase())
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(guildDb.language, 'Settings.errorSame'),
          });
        if (!isValid(value))
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(guildDb.language, 'Settings.errorInvalid'),
          });
        if (!dateType(value))
          return modalInteraction.reply({
            ephemeral: true,
            content: client.translation.get(guildDb.language, 'Settings.errorInvalid'),
          });

        const dailyMsgs = new EmbedBuilder()
          .setTitle(client.translation.get(guildDb.language, 'Settings.embed.dailyTitle'))
          .setDescription(
            `${client.translation.get(guildDb.language, 'Settings.embed.dailyMsg')}: ${
              guildDb.dailyMsg ? config.emojis.check.full : config.emojis.close.full
            }\n${client.translation.get(guildDb.language, 'Settings.embed.dailyChannel')}: ${
              guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : config.emojis.close.full
            }\n${client.translation.get(guildDb.language, 'Settings.embed.dailyRole')}: ${
              guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : config.emojis.close.full
            }\n${client.translation.get(
              guildDb.language,
              'Settings.embed.dailyTimezone'
            )}: ${value}\n${client.translation.get(guildDb.language, 'Settings.embed.dailyInterval')}: ${
              guildDb.dailyInterval
            }\n${client.translation.get(guildDb.language, 'Settings.embed.dailyType')}: ${guildDb.customTypes}` +
              `${client.translation.get(guildDb.language, 'Settings.embed.dailyThread')}: ${
                guildDb.dailyThread ? config.emojis.check.full : config.emojis.close.full
              }`
          )
          .setColor(config.colors.primary);

        const dailyButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('dailyMsg')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyMsg'))
            .setStyle(guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('dailyChannel')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyChannel'))
            .setStyle(guildDb.dailyChannel ? ButtonStyle.Success : ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('dailyType')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyType'))
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📝')
        );

        const dailyButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('dailyTimezone')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyTimezone'))
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🌍'),
          new ButtonBuilder()
            .setCustomId('dailyRole')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyRole'))
            .setStyle(guildDb.dailyRole ? ButtonStyle.Success : ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('dailyInterval')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyInterval'))
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⏰')
        );

        const dailyButtons3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('dailyThread')
            .setLabel(client.translation.get(guildDb.language, 'Settings.button.dailyThread'))
            .setStyle(guildDb.dailyThread ? ButtonStyle.Success : ButtonStyle.Secondary)
        );

        await client.database.updateGuild(interaction.guild.id, {
          dailyTimezone: value,
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
