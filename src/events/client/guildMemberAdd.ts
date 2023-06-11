import {
  EmbedBuilder,
  Events,
  GuildMember,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';

import config from '@config';
import CoreEvent from '@utils/builders/CoreEvent';
import { BaseQuestion, CustomQuestion, GuildPackType } from '@would-you/types';

export default new CoreEvent({
  name: Events.GuildMemberAdd,
}).execute(async (client, member: GuildMember) => {
  // Always do simple if checks before the main code. This is a little but not so little performance boost :)
  if (member.user.bot) return;

  // Fetch the guild profile
  const guildProfile = await client.guildProfiles.fetch(member.guild.id);

  if (
    !guildProfile.welcome.enabled ||
    !guildProfile.welcome.channel ||
    !guildProfile.welcome.ping
  )
    return;

  const channel = (await member.guild.channels.fetch(
    guildProfile.welcome.channel
  )) as TextChannel | null;

  if (!channel || !client.user?.id) return;

  const clientMember = await member.guild.members.fetch(client.user.id);
  const requiredPerms = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ];
  if (!channel.permissionsFor(clientMember).has(requiredPerms)) return;

  // Get a random question
  const randomQuestionData = client.packs.random(guildProfile.packType);

  let randomQuestion: string;
  if (guildProfile.packType === GuildPackType.Base)
    randomQuestion = (randomQuestionData as BaseQuestion).translations[
      guildProfile.language
    ];
  else if (guildProfile.packType === GuildPackType.Custom)
    randomQuestion = (randomQuestionData as CustomQuestion).text;
  else if ((randomQuestionData as CustomQuestion).text) {
    randomQuestion = (randomQuestionData as BaseQuestion).translations[
      guildProfile.language
    ];
  } else {
    randomQuestion = (randomQuestionData as CustomQuestion).text;
  }

  const welcomeEmbed = new EmbedBuilder()
    .setTitle(`Welcome ${member.user.username}!`)
    .setColor(config.colors.primary)
    .setThumbnail(member.user.avatarURL())
    .setDescription(randomQuestion);

  return channel
    .send({ content: `<@${member.user.id}>`, embeds: [welcomeEmbed] })
    .catch(client.logger.error);
});
