import { BaseInteraction, Events } from 'discord.js';

import config from '@config';
import { CoreEvent } from '@typings/core';
import buttonMiddleware from '@utils/middleware/button.middleware';

const cooldown = new Set();

export default <CoreEvent>{
  name: Events.InteractionCreate,
  /**
   * Execute the event handler.
   * @param client The extended client.
   * @param interaction The interaction.
   * @returns A promise.
   */
  execute: async (client, interaction: BaseInteraction): Promise<unknown> => {
    if (!interaction.isButton()) return;
    if (!interaction.guild || !interaction.channel?.id || !client.user) return;
    const { customId, user, guild } = interaction;

    // If the client has not synced with the database
    if (!client.synced)
      return interaction.reply({
        content: `${client.user.username} is starting up, try again in a few seconds.`,
        ephemeral: true,
      });

    // Fetch the guild profile
    const guildProfile = await client.guildProfiles.fetch(guild.id).catch((error) => {
      client.logger.error(error);
      return undefined;
    });

    // If the guild profile is not found
    if (!guildProfile)
      return interaction.reply({
        content: 'The bot is currently starting up, please try again in a few seconds.',
        ephemeral: true,
      });

    let buttonId = customId;

    // If the button has arguments
    if (buttonId.includes('*')) {
      const index = buttonId.indexOf('*');
      buttonId = buttonId.substring(0, index);
    }

    // Get the button if it exists
    const button = client.buttons.get(buttonId);

    // If the button could not be found
    if (!button)
      return interaction.reply({
        content:
          'There is no code for this button. It may have updated, please try to re-use the command that made the button.',
        ephemeral: true,
      });

    // If the button is a developer only button and the user is not a developer
    if (button.developer && !config.developers.includes(user.id))
      return interaction.reply({
        content: 'This interaction is only available to the developer',
        ephemeral: true,
      });

    try {
      // If the user is on button cooldown
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
      setTimeout(() => cooldown.delete(user.id), config.limits.cooldown.button[guildProfile.premium.enabled ? 1 : 0]);

      // If the button has arguments
      if (customId.includes('*')) {
        // Get the button argments
        const args = customId.substring(customId.indexOf('*') + 1, customId.length).split('-');

        // If the interaction should not be used by other members
        if (button.perUser) {
          const userId = args[0];

          if (user.id !== userId)
            return interaction.reply({
              content: 'This is for someone else.',
              ephemeral: true,
            });

          // Remove user id from args
          args.shift();

          // Execute the button with args
          await button.execute(client, interaction, args);
        } else {
          // Execute the button without args
          await button.execute(client, interaction);
        }
      }

      // Run the button middleware
      buttonMiddleware(client, interaction);
    } catch (err) {
      if (err) client.logger.error(err);
      interaction.reply({
        content: 'An error occurred while trying to execute that command.',
        ephemeral: true,
      });
    }
  },
};
