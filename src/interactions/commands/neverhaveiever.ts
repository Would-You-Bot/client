import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('neverhaveiever')
    .setDescription('Get a never have I ever message.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Bekomme eine nie habe ich jemals Nachricht.',
      'es-ES': 'Consigue un mensaje Nunca he tenido',
    }),
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const { Funny, Basic, Young, Food, RuleBreak } =
      await require(`../data/nhie-${guildDb.language}.json`);
    const neverArray = [...Funny, ...Basic, ...Young, ...Food, ...RuleBreak];
    const randomNever = Math.floor(Math.random() * neverArray.length);

    let ratherembed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setFooter({
        text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`,
        iconURL: interaction.user.avatarURL() || undefined,
      })
      .setDescription(neverArray[randomNever]);

    const mainRow = new ActionRowBuilder<ButtonBuilder>();
    if (Math.round(Math.random() * 15) < 3) {
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel('Invite')
          .setStyle(5)
          .setEmoji(config.emojis.logo.id)
          .setURL(config.links.invite),
      ]);
    }
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel('New Question')
        .setStyle(1)
        .setEmoji(config.emojis.replay.id)
        .setCustomId(`neverhaveiever`),
    ]);

    const time = 60_000;
    const three_minutes = 3 * 60 * 1e3;

    const vote = await client.voting.generateVoting(
      interaction.guildId,
      interaction.channelId,
      time < three_minutes ? 0 : ~~((Date.now() + time) / 1000),
      1
    );

    if (!vote) return;

    interaction
      .reply({ embeds: [ratherembed], components: [vote.row, mainRow] })
      .catch((err) => console.log(err));
  },
};

export default command;
