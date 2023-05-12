import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { ExtendedClient } from 'src/client';

export default {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command!')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Hilfe Befehl!',
      'es-ES': 'Comando de ayuda!',
    }),
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!client.application) return;

    const commands = await client.application.commands.fetch({
      withLocalizations: true,
    });

    let type: string;
    if (guildDb.language === 'de_DE') {
      type = 'de';
    } else if (guildDb.language === 'en_EN') {
      type = 'en';
    } else if (guildDb.language === 'es_ES') {
      type = 'es';
    }
    const helpembed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(guildDb?.language, 'Help.embed.footer'),
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, 'Help.embed.title'))
      .addFields({
        name: client.translation.get(
          guildDb?.language,
          'Help.embed.Fields.privacyname'
        ),
        value: client.translation.get(
          guildDb?.language,
          'Help.embed.Fields.privacy'
        ),
        inline: false,
      })
      .setDescription(
        client.translation.get(guildDb?.language, 'Help.embed.description') +
          `\n\n${commands
            .filter((e) => e.name !== 'reload')
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((n) => {
              if (n.descriptionLocalizations)
                return `</${n.name}:${n.id}> - ${
                  type === 'de'
                    ? n.descriptionLocalizations.de
                    : type === 'es'
                    ? n.descriptionLocalizations['es-ES']
                    : n.description
                }`;
            })
            .join('\n')}`
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(
          client.translation.get(guildDb?.language, 'Help.button.title')
        )
        .setStyle(5)
        .setEmoji('💫')
        .setURL(config.links.support),
      new ButtonBuilder()
        .setLabel('Invite')
        .setStyle(5)
        .setEmoji(config.emojis.logo.id)
        .setURL(config.links.invite)
    );
    await interaction
      .reply({
        embeds: [helpembed],
        components: [button],
      })
      .catch((err) => {
        return;
      });
  },
};
