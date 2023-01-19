const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote for me!')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Stimme für mich ab!',
            "es-ES": '¡Vota por mí!'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const {Vote} = require(`../languages/${guildDb.language}.json`);

        const votemebed = new EmbedBuilder()
            .setColor('#5865f4')
            .setTitle(`${Vote.embed.title}`)
            .addFields(
                {
                    name: 'Top.gg',
                    value: `> [ ${Vote.embed.value}  ](https://top.gg/bot/981649513427111957/vote)`,
                    inline: true,
                },
                {
                    name: 'Discord Bot List',
                    value: `> [ ${Vote.embed.value}  ](https://discordbotlist.com/bots/would-you-8427/upvote)`,
                    inline: true,
                },
                {
                    name: 'Discord-Botlist.eu',
                    value: '> [ ${Vote.embed.value}  ](https://discord-botlist.eu/bots/wouldyou)',
                    inline: true,
                }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: `${Vote.embed.footer}`,
                iconURL: client.user.avatarURL(),
            });

        return interaction.reply({
            embeds: [votemebed],
        }).catch((err) => {
            return;
        });
    },
};
