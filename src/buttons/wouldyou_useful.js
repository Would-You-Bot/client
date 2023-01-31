const {ButtonBuilder, ActionRowBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: {
        name: 'wouldyou_useful',
        description: 'Would you useful',
    },
    async execute(interaction, client, guildDb) {
        let power;
        let wouldyouembed;
        const {WouldYou} = await require(`../languages/${guildDb.language}.json`);
        const {Useful_Powers} = await require(`../data/power-${guildDb.language}.json`);
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
                .setCustomId('wouldyou_useful'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newbutton];
        } else {
            rbutton = [newbutton];
        }

        if (guildDb.customTypes === "regular") {
            power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
        } else if (guildDb.customTypes === "mixed") {
            let array = [];
            if (guildDb.customMessages.filter(c => c.type === "useful") != 0) {
                array.push(guildDb.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useful").length)].msg || Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
            } else {
                power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
            }
            array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
            power = array[Math.floor(Math.random() * array.length)]
            array = [];
        } else if (guildDb.customTypes === "custom") {
            if (guildDb.customMessages.filter(c => c.type === "useful") == 0) return await interaction.reply({
                ephemeral: true,
                content: `${Rather.button.nocustom}`
            })
            power = guildDb.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * guildDb.customMessages.filter(c => c.type === "useful").length)].msg;
        }

        wouldyouembed = new EmbedBuilder()
            .setColor('#0598F6')
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
