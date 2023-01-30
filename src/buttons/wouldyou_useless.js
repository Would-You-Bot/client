const {ButtonBuilder, ActionRowBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: {
        name: 'wouldyou_useless',
        description: 'Would you useful',
    },
    async execute(interaction, client, guildDb) {
        let wouldyouembed;
        const {WouldYou} = await require(`../languages/${guildDb.language}.json`);
        const {Useless_Powers} = await require(`../data/power-${guildDb.language}.json`);
        if (!guildDb.replay) return await interaction.reply({ephemeral: true, content: WouldYou.replays.disabled})
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands'),
        );
        const newbutton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Replay')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId('wouldyou_useless'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newbutton];
        } else {
            rbutton = [newbutton];
        }

        let power;
        if (guildDb.customTypes === "regular") {
            power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
        } else if (guildDb.customTypes === "mixed") {
            let array = [];
            if (guildDb.customMessages.filter(c => c.type === "useless") != 0) {
                array.push(guildDb.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useless").length)].msg || Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
            } else {
                power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
            }
            array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
            power = array[Math.floor(Math.random() * array.length)]
            array = [];
        } else if (guildDb.customTypes === "custom") {
            if (guildDb.customMessages.filter(c => c.type === "useless") == 0) return await interaction.reply({
                ephemeral: true,
                content: `${Rather.button.nocustom}`
            })
            power = guildDb.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useless").length)].msg;
        }

        wouldyouembed = new EmbedBuilder()
            .setColor('#F00505')
            .setFooter({
                text: `${WouldYou.embed.footer}`,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .addFields({
                name: WouldYou.embed.Usefulname,
                value: `> ${power}`,
                inline: false,
            });
        await interaction.reply({
            embeds: [wouldyouembed],
            fetchReply: true,
            components: rbutton,
        }).catch((err) => {
            return;
        });
    },
};
