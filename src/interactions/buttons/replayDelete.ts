import { ButtonInteraction } from 'discord.js';

// import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'replayDelete',
  description: 'Replay Delete',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    // ! temp if statement to prevent eslint warning
    if (!interaction.guild || !client.user || !guildDb) return null;

    // ! This code was trying to get `values` from a button interaction

    /* const arr =
      guildDb.replayChannels.filter((c) => c.id !== interaction.values[0])
        .length > 0
        ? guildDb.replayChannels
        : 'None';

    const generalMsg = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, 'Settings.embed.generalTitle')
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          'Settings.embed.replayType'
        )}: ${guildDb.replayType}\n ${client.translation.get(
          guildDb?.language,
          'Settings.embed.replayChannels'
        )}: ${
          arr === 'None'
            ? arr
            : `\n${arr
                .filter((c) => c.id !== interaction.values[0])
                .map((c) => `<#${c.id}>: ${c.cooldown}`)
                .join('\n')}`
        }`
      )
      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          'Settings.embed.footer'
        ),
        iconURL: client.user?.avatarURL() || undefined,
      });

    const generalButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('replayChannels')
        .setLabel(
          client.translation.get(
            guildDb?.language,
            'Settings.button.replayCooldown'
          )
        )
        .setStyle(
          guildDb.replayCooldown ? ButtonStyle.Success : ButtonStyle.Secondary
        ),
      new ButtonBuilder()
        .setCustomId('replayType')
        .setLabel(
          client.translation.get(
            guildDb?.language,
            'Settings.button.replayType'
          )
        )
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📝')
    );

    const chanDelete = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('replayDeleteChannels')
        .setLabel(
          client.translation.get(
            guildDb?.language,
            'Settings.button.replayDeleteChannels'
          )
        )
        .setStyle(ButtonStyle.Danger)
    );

    guildDb.replayChannels = guildDb.replayChannels.filter(
      (c) => c.id !== interaction.values[0]
    );
    await client.database.updateGuild(interaction.guild.id, {
      replayChannels: guildDb.replayChannels,
    });

    return interaction.update({
      content: '',
      embeds: [generalMsg],
      components: [generalButtons, chanDelete],
    }); */
  },
};

export default button;
