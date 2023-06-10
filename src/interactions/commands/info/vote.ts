import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@config';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for me!')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Stimme für mich ab!',
      'es-ES': '¡Vota por mí!',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const votemebed = new EmbedBuilder()
    .setColor(config.colors.blurple)
    .setTitle(translations.vote.embed.title)
    .addFields(
      {
        name: 'Top.gg',
        value: `> [ ${translations.vote.embed.value}  ](https://top.gg/bot/${config.productionId}/vote)`,
        inline: true,
      },
      {
        name: 'Voidbots',
        value: `> [ ${translations.vote.embed.value}  ](https://voidbots.net/bot/${config.productionId})`,
        inline: true,
      }
    )
    .setThumbnail(client.user?.displayAvatarURL() ?? null);

  return interaction
    .reply({
      embeds: [votemebed],
    })
    .catch(client.logger.error);
});
