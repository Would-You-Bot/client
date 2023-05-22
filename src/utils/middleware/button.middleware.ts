import { ButtonInteraction, PermissionFlagsBits } from 'discord.js';

import { IExtendedClient } from '@typings/core';

/**
 * The button middleware.
 * @param client The extended client.
 * @param interaction The interaction.
 * @returns A promise.
 */
const buttonMiddleware = async (client: IExtendedClient, interaction: ButtonInteraction): Promise<void> => {
  const { user, guild, customId } = interaction;
  if (!guild) return;

  const member = await guild.members.fetch(user.id);

  client.logger.info(
    `${user.tag} (${
      user.id === guild.ownerId ? 'owner' : member.permissions.has(PermissionFlagsBits.Administrator) ? 'admin' : ''
    }) clicked \`${customId}\` in ${guild.name} (${guild.memberCount}) <t:${(Date.now() / 1000).toFixed(
      0
    )}:R> ${`unsaved`}`
  );
};

export default buttonMiddleware;
