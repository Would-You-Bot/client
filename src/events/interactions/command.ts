import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Events,
} from 'discord.js';

import config from '@config';
import { CoreEventOptions } from '@typings/core';
import commandMiddleware from '@utils/middleware/command.middleware';

const cooldown = new Set();

export default <CoreEventOptions>{
  name: Events.InteractionCreate,
  /**
   * Execute the event handler.
   * @param client The extended client.
   * @param interaction The interaction.
   * @returns A promise.
   */
  execute: async (client, interaction: BaseInteraction): Promise<unknown> => {
    if (!interaction.isCommand()) return;
    if (!interaction.guild || !interaction.channel?.id || !client.user) return;
    const { commandName, guild, user } = interaction;

    // If the client has not synced with the database
    if (!client.synced)
      return interaction.reply({
        content: `${client.user.username} is starting up, try again in a few seconds.`,
        ephemeral: true,
      });

    // Fetch the guild profile
    const guildProfile = await client.guildProfiles
      .fetch(guild.id)
      .catch((error) => {
        client.logger.error(error);
        return undefined;
      });

    // If the guild profile is not found
    if (!guildProfile)
      return interaction.reply({
        content: 'An error occurred while fetching the guild profile.',
        ephemeral: true,
      });

    const command = client.commands.get(commandName);

    // If the command is not found
    if (!command)
      return interaction.reply({
        content:
          'There is no code for this command. It may have updated, please try to re-use the command.',
        ephemeral: true,
      });

    try {
      // If the user is on command cooldown
      if (cooldown.has(user.id)) {
        const msg = await interaction.reply({
          content: `Woah, a little bit too fast there <@${user.id}>. Please try again after a few seconds.`,
          ephemeral: true,
        });
        setTimeout(() => {
          msg.delete().catch(client.logger.error);
        }, 3000);
        return;
      }

      // Add the user to the cooldown set
      cooldown.add(user.id);
      // Remove the user from the cooldown set after the specified button cooldown time
      setTimeout(
        () => cooldown.delete(user.id),
        config.limits.cooldown.button[guildProfile.premium.enabled ? 1 : 0]
      );

      command.execute(client, interaction, guildProfile);

      // Run the command middleware
      commandMiddleware(client, interaction as ChatInputCommandInteraction);
    } catch (err) {
      if (err) client.logger.error(err);
      interaction.reply({
        content: 'An error occurred while trying to execute that command.',
        ephemeral: true,
      });
    }
  },
};
