import config from '@config';
import { CoreEvent } from '@typings/core';
import {
  EmbedBuilder,
  Events,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';

import { GuildMember } from 'discord.js';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  name: Events.GuildMemberAdd,
  async execute(client: ExtendedClient, member: GuildMember) {
    // Always do simple if checks before the main code. This is a little but not so little performance boost :)
    if (member?.user?.bot) return;

    const guildDb = await client.database.getGuild(member.guild.id, false);
    if (guildDb && guildDb?.welcome) {
      const channel = (await member.guild.channels
        .fetch(guildDb.welcomeChannel)
        .catch(client.logger.error)) as TextChannel | null;

      if (!channel || !client.user?.id) return;

      const clientMember = await member.guild.members.fetch(client.user?.id);

      if (
        !channel
          .permissionsFor(clientMember)
          .has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
          ])
      )
        return;

      const { General } = await import(
        `../constants/rather-${guildDb.language}.json`
      );
      const randomrather = Math.floor(Math.random() * General.length);
      let mention = undefined;

      if (guildDb.welcomePing) {
        mention = `<@${member.user.id}>`;
      }

      let welcomeEmbed = new EmbedBuilder()
        .setTitle(`Welcome ${member.user.username}!`)
        .setColor(config.colors.primary)
        .setThumbnail(member.user.avatarURL())
        .setDescription(`${General[randomrather]}`);

      return channel
        .send({ content: mention, embeds: [welcomeEmbed] })
        .catch(client.logger.error);
    }
  },
};

export default event;
