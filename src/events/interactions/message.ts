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
import { CoreEventOptions } from '@typings/core';

const cooldown = new Set();

export default <CoreEventOptions>{
  name: Events.MessageCreate,
  /**
   * Execute the event handler.
   * @param client The extended client.
   * @param message The message.
   * @returns A promise.
   */
  async execute(client, message: Message): Promise<unknown> {
    if (!client.user?.id) return;
    if (message.channel.type !== ChannelType.GuildText) return;
    const requiredPerms = [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.EmbedLinks,
    ];
    if (!message.channel.permissionsFor(client.user.id)?.has(requiredPerms))
      return;
    if (cooldown.has(message.channel.id)) return;

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

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

    // Add the channel to the cooldown set
    cooldown.add(message.channel.id);
    // Remove the channel from the cooldown set after 10 seconds
    setTimeout(() => {
      cooldown.delete(message.channel.id);
    }, 1000 * 10);

    // If the user mentions the bot
    if (
      message.content &&
      new RegExp(`^(<@!?${client.user.id}>)`).test(message.content)
    )
      return message.channel
        .send({
          embeds: [embed],
          components: [buttons],
        })
        .catch(client.logger.error);
  },
};
