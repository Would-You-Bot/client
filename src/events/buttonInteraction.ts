import { CoreEvent } from '@typings/core';
import { BaseInteraction, Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  name: Events.InteractionCreate,
  /**
   * Execute the event handler.
   * @param params The event parameters.
   * @returns A promise.
   */
  execute: async (...params) => {
    const [interaction, client] = params as [BaseInteraction, ExtendedClient];

    if (!interaction.isButton()) return;
    if (!interaction.guild || !interaction.channel?.id || !client.user) return;

    const guildProfile = await client.database.getGuild(interaction.guild.id, true);

    // If the guild profile is not found
    if (!guildProfile)
      return interaction.reply({ content: 'An error occurred while fetching the guild profile.', ephemeral: true });

    if (client.used.has(interaction.user.id))
      return interaction
        .reply({
          ephemeral: true,
          content: `<t:${Math.floor(
            guildProfile.replayCooldown / 1000 + Date.now() / 1000
          )}:R> you can use buttons again!`,
        })
        .catch(client.logger.error);
    else if (
      guildProfile.replayType === 'Channels' &&
      client.used.has(`${interaction.user.id}-${interaction.channel.id}`)
    ) {
      return interaction
        .reply({
          ephemeral: true,
          content: `<t:${Math.floor(
            (guildProfile.replayChannels.find((replayChannel) => replayChannel.id === interaction.channel?.id)
              ?.cooldown ?? 1000) /
              1000 +
              Date.now() / 1000
          )}:R> you can use buttons again!`,
        })
        .catch(client.logger.error);
    }

    let button = client.buttons.get(interaction.customId);

    if (interaction.customId.startsWith('voting_')) button = client.buttons.get('voting');
    if (interaction.customId.startsWith('result_')) button = client.buttons.get('result');

    if (!button)
      return interaction
        .reply({
          content: 'Please use the command again.',
          ephemeral: true,
        })
        .catch(client.logger.error);

    try {
      if (!interaction.customId.startsWith('voting_') && !interaction.customId.startsWith('result_')) {
        if (
          guildProfile.replayType === 'Channels' &&
          guildProfile.replayChannels.find((replayChannel) => replayChannel.id === interaction.channel?.id)
        ) {
          client.used.set(
            `${interaction.user.id}-${interaction.channel.id}`,
            Date.now() +
              (guildProfile.replayChannels.find((replayChannel) => replayChannel.id === interaction.channel?.id)
                ?.cooldown ?? 1000)
          );
          setTimeout(
            () => client.used.delete(`${interaction.user.id}-${interaction.channel?.id ?? ''}`),
            guildProfile.replayChannels.find((replayChannel) => replayChannel.id === interaction.channel?.id)
              ?.cooldown ?? 1000
          );
        } else {
          client.used.set(interaction.user.id, Date.now() + guildProfile.replayCooldown);
          setTimeout(() => client.used.delete(interaction.user.id), guildProfile.replayCooldown);
        }
      }

      return button.execute(interaction, client, guildProfile);
    } catch (err) {
      if (err) client.logger.error(err);
      return interaction.reply({
        content: 'An error occurred while trying to execute that command.',
        ephemeral: true,
      });
    }
  },
};

export default event;
