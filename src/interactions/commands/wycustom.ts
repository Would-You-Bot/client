import axios from 'axios';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  CollectedInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/GuildProfile.model';
import { CoreSlashCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

/**
 * @param length
 */
function makeID(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const command: CoreSlashCommand = {
  data: new SlashCommandBuilder()
    .setName('wycustom')
    .setDescription('Adds custom WouldYou messages.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      'de': 'Fügt eigene WouldYou Fragen hinzu.',
      'es-ES': 'Añade mensajes Would You personalizados.',
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Adds a custom message')
        .addStringOption((option) =>
          option
            .setName('options')
            .setDescription('Select which category you want this custom message to be in.')
            .setRequired(true)
            .addChoices(
              { name: 'Would You Rather', value: 'wouldyourather' },
              { name: 'Never Have I Ever', value: 'neverhaveiever' },
              { name: 'What Would You Do', value: 'wwyd' }
            )
        )
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription('Input a message to create a custom WouldYou message.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Removes a custom message.')
        .addStringOption((option) =>
          option.setName('message').setDescription('Input a custom WouldYou ID number to remove it.').setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand.setName('removeall').setDescription('Removes all custom messages.'))
    .addSubcommand((subcommand) =>
      subcommand.setName('view').setDescription('Views all of your custom WouldYou messages')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('import')
        .setDescription('Imports custom messages from a JSON file.')
        .addAttachmentOption((option) =>
          option
            .setName('attachment')
            .setDescription('Import a JSON file containing useless or useful Would You custom messages.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('export').setDescription('Exports custom messages into a JSON file.')
    ),
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    if (!interaction.guildId) return;

    const typeEmbed = new EmbedBuilder();
    let message: string;

    /**
     *
     */
    class Paginator {
      pages: EmbedBuilder[];
      timeout: number;
      page: number;
      endPage: number;

      /**
       * @param pages
       * @param root0
       * @param root0.filter
       * @param root0.timeout
       */
      constructor(
        pages: [] = [],
        { filter, timeout }: { filter?: () => boolean; timeout: number } = {
          /**
           *
           */
          filter: () => true,
          timeout: 5 * 6e4,
        }
      ) {
        this.pages = Array.isArray(pages) ? pages : [];
        this.timeout = Number(timeout) || 5 * 6e4;
        this.page = 0;
        this.endPage = this.pages.length - 1;

        if (filter) filter();
      }

      /**
       * @param page
       */
      add(page: EmbedBuilder) {
        this.pages.push(page);
        return this;
      }

      /**
       * @param page
       */
      setEndPage(page: number) {
        if (page) this.endPage = page;
        return this;
      }

      /**
       * @param fn
       */
      setTransform(fn: (...args: any) => any) {
        const pages = [];
        let i = 0;
        const ln = this.pages.length;
        for (const page of this.pages) {
          pages.push(fn(page, i, ln));
          i += 1;
        }
        this.pages = pages;
        return this;
      }

      /**
       * @param channel
       * @param buttons
       */
      async start(channel: ChatInputCommandInteraction, buttons: ActionRowBuilder<ButtonBuilder>) {
        if (!this.pages.length) return;
        const msg = await channel.reply({
          embeds: [this.pages[0]],
          components: [buttons],
          ephemeral: true,
        });
        const collector = msg.createMessageComponentCollector();

        collector.on('collect', async (inter: CollectedInteraction): Promise<any> => {
          try {
            if (inter.isButton()) {
              if (!inter) return;

              switch (inter.customId) {
                case 'first':
                  if (this.page === 0) {
                    return inter.reply({
                      ephemeral: true,
                      content: client.translation.get(guildDb.language, 'wyCustom.error.paginate'),
                    });
                  } else {
                    await inter.update({
                      embeds: [this.pages[0]],
                    });
                    this.page = 0;
                    return;
                  }
                case 'prev':
                  if (this.pages[this.page - 1]) {
                    inter.update({
                      embeds: [this.pages[(this.page -= 1)]],
                    });
                    return;
                  } else {
                    inter.reply({
                      ephemeral: true,
                      content: client.translation.get(guildDb.language, 'wyCustom.error.paginate'),
                    });
                    return;
                  }
                case 'next':
                  if (this.pages[this.page + 1]) {
                    inter.update({
                      embeds: [this.pages[(this.page += 1)]],
                    });
                    return;
                  } else {
                    return inter.reply({
                      ephemeral: true,
                      content: client.translation.get(guildDb.language, 'wyCustom.error.paginate'),
                    });
                  }
                case 'last':
                  if (this.page === this.pages.length - 1) {
                    return inter.reply({
                      ephemeral: true,
                      content: client.translation.get(guildDb.language, 'wyCustom.error.paginate'),
                    });
                  } else {
                    await inter.update({
                      embeds: [this.pages[this.pages.length - 1]],
                    });
                    this.page = this.pages.length - 1;
                    return;
                  }
                default: {
                  return;
                }
              }
            }
          } catch (error) {
            client.logger.error(error);
          }
        });
      }
    }
    if (client.checkDebug(guildDb, interaction.user.id)) {
      switch (interaction.options.getSubcommand()) {
        case 'add': {
          if (!client.voteLogger.votes.has(interaction.user.id)) {
            if (guildDb.customMessages.length >= 30)
              return interaction.reply({
                ephemeral: true,
                content: client.translation.get(guildDb.language, 'wyCustom.error.maximum'),
              });
          }

          const option = interaction.options.getString('options')?.toLowerCase()!;
          message = interaction.options.getString('message')!;

          const newID = makeID(6);
          typeEmbed
            .setTitle(client.translation.get(guildDb.language, 'wyCustom.success.embedAdd.title'))
            .setColor(config.colors.primary)
            .setDescription(
              `**${client.translation.get(
                guildDb.language,
                'wyCustom.success.embedAdd.descID'
              )}**: ${newID}\n**${client.translation.get(
                guildDb.language,
                'wyCustom.success.embedAdd.descCat'
              )}**: ${option}\n\n**${client.translation.get(
                guildDb.language,
                'wyCustom.success.embedAdd.descCont'
              )}**: \`${message}\``
            )
            .setFooter({
              text: 'Would You',
              iconURL: client.user?.avatarURL() || undefined,
            });

          guildDb.customMessages.push({
            id: newID,
            msg: message,
            type: option,
          });

          await client.database.updateGuild(
            interaction.guildId,
            {
              customMessages: guildDb.customMessages,
            },
            true
          );
          break;
        }
        case 'remove': {
          message = interaction.options.getString('message')!;

          typeEmbed
            .setTitle(client.translation.get(guildDb.language, 'wyCustom.success.embedRemove.title'))
            .setColor(config.colors.primary)
            .setFooter({
              text: 'Would You',
              iconURL: client.user?.avatarURL() || undefined,
            });

          if (!guildDb.customMessages.find((c) => c.id.toString() === message))
            return interaction.reply({
              ephemeral: true,
              content: 'There is no custom WouldYou message with that ID!',
            });

          const filtered = guildDb.customMessages.filter((c) => c.id.toString() !== message);

          await client.database.updateGuild(
            interaction.guildId,
            {
              customMessages: filtered,
            },
            true
          );
          break;
        }
        case 'removeall': {
          if (guildDb.customMessages.length === 0)
            return interaction.reply({
              content: client.translation.get(guildDb.language, 'wyCustom.success.embedRemoveAll.none'),
              ephemeral: true,
            });

          typeEmbed
            .setTitle(client.translation.get(guildDb.language, 'wyCustom.success.embedRemoveAll.title'))
            .setColor(config.colors.primary)
            .setFooter({
              text: 'Would You',
              iconURL: client.user?.avatarURL() || undefined,
            });

          const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setLabel('Accept').setStyle(ButtonStyle.Danger).setCustomId('wycustom_accept'),
            new ButtonBuilder().setLabel('Decline').setStyle(ButtonStyle.Secondary).setCustomId('wycustom_decline')
          );

          interaction.reply({
            embeds: [typeEmbed],
            components: [button],
            ephemeral: true,
          });
          break;
        }
        case 'view': {
          if (guildDb.customMessages.length === 0)
            return interaction.reply({
              ephemeral: true,
              content: client.translation.get(guildDb.language, 'wyCustom.error.empty'),
            });

          const page = new Paginator([]);

          if (guildDb.customMessages.filter((c) => c.type === 'useless').length > 0) {
            let data: (string | Paginator)[];
            data = guildDb.customMessages
              .filter((c) => c.type === 'useless')
              .map(
                (s) =>
                  `${client.translation.get(guildDb.language, 'wyCustom.success.embedAdd.descID')}: ${
                    s.id
                  }\n${client.translation.get(guildDb.language, 'wyCustom.success.embedAdd.descMsg')}: ${s.msg}`
              );

            const preData = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = preData.map((e) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(client.translation.get(guildDb.language, 'wyCustom.success.paginator.title'))
                  .setDescription(
                    `${client.translation.get(guildDb.language, 'wyCustom.success.paginator.descCatUseful')}\n\n${e
                      .slice(0, 5)
                      .join('\n\n')
                      .toString()}`
                  )
              )
            );
          }

          if (guildDb.customMessages.filter((c) => c.type === 'useful').length > 0) {
            let data: (string | Paginator)[];
            data = guildDb.customMessages
              .filter((c) => c.type === 'useful')
              .map(
                (s) =>
                  `${client.translation.get(guildDb.language, 'wyCustom.success.embedAdd.descID')}: ${
                    s.id
                  }\n${client.translation.get(guildDb.language, 'wyCustom.success.embedAdd.descMsg')}: ${s.msg}`
              );

            const preData = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = preData.map((e) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(client.translation.get(guildDb.language, 'wyCustom.success.paginator.title'))
                  .setDescription(
                    `${client.translation.get(guildDb.language, 'wyCustom.success.paginator.descCatUseless')}\n\n${e
                      .slice(0, 5)
                      .join('\n\n')
                      .toString()}`
                  )
              )
            );
          }

          page.setTransform((embed: EmbedBuilder, index: number, total: number) =>
            embed.setFooter({
              text: `Would You | Page ${index + 1} / ${total}`,
              iconURL: client.user?.avatarURL() || undefined,
            })
          );

          const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId('first').setLabel('⏪').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('prev').setLabel('◀️').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('next').setLabel('▶️').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('last').setLabel('⏩').setStyle(ButtonStyle.Primary)
          );

          return page.start(interaction, buttons);
        }
        case 'import': {
          const attachemnt = interaction.options.get('attachment');

          if (!attachemnt?.attachment)
            return interaction.reply({
              ephemeral: true,
              content: client.translation.get(guildDb.language, 'wyCustom.error.import.att1'),
            });

          if (!attachemnt.attachment.name.includes('.json'))
            return interaction.reply({
              ephemeral: true,
              content: client.translation.get(guildDb.language, 'wyCustom.error.import.att2'),
            });

          await interaction.deferReply({ ephemeral: true });

          axios
            .get(attachemnt.attachment.url, {
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(async (response) => {
              if (response.data.length === 0)
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att3'),
                });
              if (!response.data.wouldyourather && !response.data.neverhaveiever && !response.data.wwyd)
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att4'),
                });
              if (
                response.data.wouldyourather.length !== 0 &&
                response.data.neverhaveiever !== 0 &&
                !response.data.wwyd
              )
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att5'),
                });
              if (
                response.data.wouldyourather &&
                response.data.wouldyourather.length > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              )
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att16'),
                });
              if (
                response.data.neverhaveiever &&
                response.data.neverhaveiever.length > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              )
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att17'),
                });
              if (
                response.data.wwyd &&
                response.data.wwyd.length > 30 &&
                !client.voteLogger.votes.has(interaction.user.id)
              )
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att18'),
                });

              const wouldyourather = guildDb.customMessages.filter((c) => c.type === 'wouldyourather').length;
              const neverhaveiever = guildDb.customMessages.filter((c) => c.type === 'neverhaveiever').length;
              const wwyd = guildDb.customMessages.filter((c) => c.type === 'wwyd').length;

              if (wouldyourather > 30 && !client.voteLogger.votes.has(interaction.user.id))
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att19'),
                });
              if (neverhaveiever > 30 && !client.voteLogger.votes.has(interaction.user.id))
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att20'),
                });
              if (wwyd > 30 && !client.voteLogger.votes.has(interaction.user.id))
                return interaction.editReply({
                  content: client.translation.get(guildDb.language, 'wyCustom.error.import.att21'),
                });

              if (response.data.wouldyourather) {
                if (
                  response.data.wouldyourather.length + wouldyourather > 30 &&
                  !client.voteLogger.votes.has(interaction.user.id)
                )
                  return interaction.editReply({
                    content: client.translation.get(guildDb.language, 'wyCustom.error.import.att22'),
                  });
                response.data.wouldyourather.forEach((msg: string) => {
                  const newID = makeID(6);
                  guildDb.customMessages.push({
                    id: newID,
                    msg,
                    type: 'wouldyourather',
                  });
                });
              }

              if (response.data.neverhaveiever) {
                if (
                  response.data.neverhaveiever.length + neverhaveiever > 30 &&
                  !client.voteLogger.votes.has(interaction.user.id)
                )
                  return interaction.editReply({
                    content: client.translation.get(guildDb.language, 'wyCustom.error.import.att23'),
                  });
                response.data.neverhaveiever.forEach((msg: string) => {
                  const newID = makeID(6);
                  guildDb.customMessages.push({
                    id: newID,
                    msg,
                    type: 'neverhaveiever',
                  });
                });
              }

              if (response.data.wwyd) {
                if (response.data.wwyd.length + wwyd > 30 && !client.voteLogger.votes.has(interaction.user.id))
                  return interaction.editReply({
                    content: client.translation.get(guildDb.language, 'wyCustom.error.import.att24'),
                  });
                response.data.wwyd.forEach((msg: string) => {
                  const newID = makeID(6);
                  guildDb.customMessages.push({
                    id: newID,
                    msg,
                    type: 'wwyd',
                  });
                });
              }

              await client.database.updateGuild(
                interaction.guildId!,
                {
                  customMessages: guildDb.customMessages,
                },
                true
              );

              return interaction.editReply({
                content: client.translation.get(guildDb.language, 'wyCustom.success.import'),
              });
            })
            .catch((error) =>
              interaction.editReply(
                `${client.translation.get(guildDb.language, 'wyCustom.error.import.att15')}\n\nError: ${error}`
              )
            );
          break;
        }
        case 'export': {
          if (guildDb.customMessages.length === 0)
            return interaction.reply({
              ephemeral: true,
              content: client.translation.get(guildDb.language, 'wyCustom.error.export.none'),
            });

          await interaction.deferReply();

          const wouldyourather = guildDb.customMessages.filter((c) => c.type === 'wouldyourather');
          const neverhaveiever = guildDb.customMessages.filter((c) => c.type === 'neverhaveiever');
          const wwyd = guildDb.customMessages.filter((c) => c.type === 'wwyd');

          let text = `{\n`;
          if (wouldyourather.length > 0) {
            text += `\n"wouldyourather": [`;
            wouldyourather.forEach((a, i) => {
              i += 1;
              text += `\n"${a.msg}"${wouldyourather.length !== i ? ',' : ''}`;
            });
            text += `\n]`;
          }

          if (neverhaveiever.length > 0) {
            text += `\n"neverhaveiever": [`;
            neverhaveiever.forEach((a, i) => {
              i += 1;
              text += `\n"${a.msg}"${neverhaveiever.length !== i ? ',' : ''}`;
            });
            text += `\n]`;
          }

          if (wwyd.length > 0) {
            text += `\n"wwyd": [`;
            wwyd.forEach((a, i) => {
              i += 1;
              text += `\n"${a.msg}"${wwyd.length !== i ? ',' : ''}`;
            });
            text += `\n]`;
          }
          text += `\n}`;

          return interaction.editReply({
            content: client.translation.get(guildDb.language, 'wyCustom.success.export'),
            files: [
              {
                attachment: Buffer.from(text),
                name: `Custom_Messages_${interaction.guildId}.json`,
              },
            ],
          });
        }

        default:
          break;
      }

      return interaction
        .reply({
          embeds: [typeEmbed],
          ephemeral: true,
        })
        .catch(client.logger.error);
    } else {
      const errorembed = new EmbedBuilder()
        .setColor(config.colors.danger)
        .setTitle('Error!')
        .setDescription(client.translation.get(guildDb.language, 'Language.embed.error'));
      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch(client.logger.error);
    }
  },
};

export default command;
