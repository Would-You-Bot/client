import {
  EmbedBuilder,
  Events,
  GuildMember,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';

import config from '@config';
import { CoreEventOptions } from '@typings/core';
import { GuildPackType } from '@typings/guild';
import { BaseQuestion, CustomQuestion } from '@typings/pack';

export default <CoreEventOptions>{
  name: Events.GuildMemberAdd,
  /**
   * Executes the event.
   * @param client The extended client.
   * @param member The member that joined the guild.
   * @returns A promise.
   */
  async execute(client, member: GuildMember) {
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
    const randomQuestionData = await client.packs.random(
      guildProfile.questionType
    );

    let randomQuestion: string;
    if (guildProfile.questionType === GuildPackType.Base)
      randomQuestion = (randomQuestionData as BaseQuestion).translations[
        guildProfile.language
      ];
    else if (guildProfile.questionType === GuildPackType.Custom)
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
  },
};
