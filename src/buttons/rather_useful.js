const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require('discord.js');
const generateRather = require('../util/generateRather');

module.exports = {
    data: {
        name: 'rather_useful',
        description: 'rather useful',
    },
    async execute(interaction, client, guildDb) {
        const {Rather} = await require(`../languages/${guildDb.language}.json`);
        const {Useful_Powers} = await require(`../data/power-${guildDb.language}.json`);
        if (!guildDb.replay) return await interaction.reply({ephemeral: true, content: Rather.replays.disabled})
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL(
                    'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands',
                ),
        );
        const newButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Replay')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId('rather_useful'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newButton];
        } else rbutton = [newButton];
        {
            let powers = await generateRather(guildDb, Useful_Powers, "useful");
            let ratherembed = new EmbedBuilder()
                .setColor('#0598F6')
                .addFields(
                    {
                        name: Rather.embed.usefulname,
                        value: `> 1️⃣ ${powers.power1}`,
                        inline: false,
                    },
                    {
                        name: Rather.embed.usefulname2,
                        value: `> 2️⃣ ${powers.power2}`,
                        inline: false,
                    },
                )
                .setFooter({
                    text: `${Rather.embed.footer}`,
                    iconURL: client.user.avatarURL(),
                })
                .setTimestamp();

            await interaction
                .reply({
                    embeds: [ratherembed],
                    components: rbutton,
                    fetchReply: true,
                })
                .catch((err) => {
                    return;
                });
        }
    },
};
