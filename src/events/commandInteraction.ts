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

    if (!interaction.isCommand()) return;
    if (!interaction.guild || !interaction.channel?.id || !client.user) return;

    // If the client has not synced with the database
    if (!client.synced)
      return interaction.reply({
        content: `${client.user.username} is starting up, try again in a few seconds.`,
        ephemeral: true,
      });

    const guildProfile = await client.database.getGuild(interaction.guild.id, true);

    // If the guild profile is not found
    if (!guildProfile)
      return interaction.reply({ content: 'An error occurred while fetching the guild profile.', ephemeral: true });

    const command = client.commands.get(interaction.commandName);

    // If the command is not found
    if (!command) return interaction.reply({ content: 'Command not found, it is likely outdated.', ephemeral: true });

    try {
      command.execute(interaction, client, guildProfile);
    } catch (err) {
      if (err) client.logger.error(err);
      interaction.reply({
        content: 'An error occurred while trying to execute that command.',
        ephemeral: true,
      });
    }
  },
};

export default event;
