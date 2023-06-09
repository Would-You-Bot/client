import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

import config from '@config';
import { CoreButton } from '@utils/builders';

export default new CoreButton({
  id: 'neverhaveiever',
  description: 'never have i ever',
}).execute(async (client, interaction, args) => {
  if (!interaction.guildId) return;

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  // ! pack type not question type
  const question = client.packs.random('nhie');

  const { Funny, Basic, Young, Food, RuleBreak } = (await import(`../../constants/nhie-${guildDb.language}.json`))
    .default;

  const neverArray = [...Funny, ...Basic, ...Young, ...Food, ...RuleBreak];
  const randomNever = Math.floor(Math.random() * neverArray.length);

  const ratherembed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setFooter({
      text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`,
      iconURL: interaction.user.avatarURL() ?? undefined,
    })
    .setFooter({
      text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomNever}`,
      iconURL: interaction.user.avatarURL() ?? undefined,
    })
    .setDescription(neverArray[randomNever]);

  const mainRow = new ActionRowBuilder<ButtonBuilder>();
  if (Math.round(Math.random() * 15) < 3) {
    mainRow.addComponents([
      new ButtonBuilder()
        .setLabel('Invite')
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.emojis.logo.id)
        .setURL(config.links.invite),
    ]);
  }
  mainRow.addComponents([
    new ButtonBuilder()
      .setLabel('New Question')
      .setStyle(ButtonStyle.Primary)
      .setEmoji(config.emojis.replay.id)
      .setCustomId(`neverhaveiever`),
  ]);

  const time = 60_000;
  const threeMinutes = 3 * 60 * 1e3;

  const vote = await client.voting.generateVoting(
    interaction.guildId,
    interaction.channelId,
    time < threeMinutes ? 0 : Math.floor((Date.now() + time) / 1000),
    1
  );

  if (!vote) return;

  return interaction
    .reply({
      embeds: [ratherembed],
      components: [vote.row, mainRow],
    })
    .catch(client.logger.error);
});
