import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from 'src/client';

/**
 * The command middleware.
 * @param client The extended client.
 * @param interaction The interaction.
 * @returns A promise.
 */
const commandMiddleware = async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
  const { user, guild, commandName } = interaction;
  if (!guild) return;

  const member = await guild.members.fetch(user.id);

  client.logger.info(
    `${user.tag} ${
      user.id === guild.ownerId
        ? '(owner)'
        : member.permissions.has(PermissionFlagsBits.Administrator)
        ? '(admin)'
        : member.permissions.has(PermissionFlagsBits.ModerateMembers)
        ? '(mod)'
        : ''
    } used \`${commandName}\` in ${guild.name} (${guild.memberCount}) <t:${(Date.now() / 1000).toFixed(
      0
    )}:R> ${`unsaved`}`
  );
};

export default commandMiddleware;
