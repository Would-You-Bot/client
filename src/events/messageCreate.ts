import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  Events,
  Message,
  PermissionFlagsBits,
} from 'discord.js';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const Cooldown = new Set();

const event: CoreEvent = {
  name: Events.MessageCreate,
  /**
   * @param client
   * @param message
   */
  async execute(client: ExtendedClient, message: Message) {
    if (!client.user?.id) return;

    // Always check the permissions before doing any actions to avoid a ratelimit IP ban =)
    if (
      message.channel.type === ChannelType.GuildText &&
      message.channel
        .permissionsFor(client.user.id)
        ?.has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
        ])
    ) {
      if (Cooldown.has(message.channel.id)) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Hello, my name is Would You.',
          iconURL:
            'https://cdn.discordapp.com/emojis/953349395955470406.gif?size=40&quality=lossless',
        })
        .setDescription(
          `My purpose is to help users have better engagement in your servers to bring up more activity! You can use ${config.emojis.help.full} to see all of my commands.`
        )
        .setColor(config.colors.primary);

      const supportbutton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(ButtonStyle.Link)
          .setEmoji('📋')
          .setURL(config.links.invite),
        new ButtonBuilder()
          .setLabel('Support')
          .setStyle(ButtonStyle.Link)
          .setEmoji('❤️')
          .setURL(config.links.support)
      );

      Cooldown.add(message.channel.id);
      setTimeout(() => {
        Cooldown.delete(message.channel.id);
      }, 10000);

      if (
        message.content &&
        new RegExp(`^(<@!?${client.user.id}>)`).test(message.content)
      )
        return message.channel
          .send({
            embeds: [embed],
            components: [supportbutton],
          })
          .catch(client.logger.error);
    }
  },
};

export default event;
