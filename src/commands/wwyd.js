const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('wwyd')
        .setDescription('What would you do in this situation')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Was würdest du in dieser Situation tun',
            "es-ES": '¿Qué harías en esta situación?'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {

        const {WhatYouDo} = require(`../data/wwyd-${guildDb.language}.json`);

        const wwydstring = WhatYouDo[Math.floor(Math.random() * WhatYouDo.length)];

        const wwydembed = new EmbedBuilder()
            .setColor('#0598F6')
            .setFooter({
                text: client.translation.get(guildDb?.language, 'Wwyd.embed.footer'),
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .setTitle(client.translation.get(guildDb?.language, 'Wwyd.embed.title'))
            .setDescription(`> ${wwydstring}`);

        return interaction.reply({embeds: [wwydembed]}).catch((err) => { });

        // Questions don't really have something where the user can select what he would choose.
        // const time = guildDb?.voteCooldown ?? 25000;
        // const three_minutes = 3 * 60 * 1000;
        //
        // const {
        //     row,
        //     id
        // } = await client.voting.generateVoting(interaction.guildId, interaction.channelId, time < three_minutes ? 0 : ~~((Date.now() + time) / 1000), 1, client.translation.get(guildDb?.language, 'Wwyd.embed.option1'), client.translation.get(guildDb?.language, 'Wwyd.embed.option2'));
        //
        // const msg = await interaction.reply({embeds: [wwydembed], components: [row]}).catch((err) => { });
        //
        // if(time < three_minutes) {
        //     setTimeout(async () => {
        //         await client.voting.endVoting(id, msg.id);
        //     }, time);
        // }
    },
};
