const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require('discord.js');

module.exports = {
    data: {
        name: 'neverhaveiever',
        description: 'never have i ever',
    },
    async execute(interaction, client, guildDb) {
        const {Funny, Basic, Young, Food, RuleBreak} = await require(`../data/nhie-${guildDb.language}.json`);
        const neverArray = [...Funny, ...Basic, ...Young, ...Food, ...RuleBreak]
        const randomNever = Math.floor(Math.random() * neverArray.length)

        let ratherembed = new EmbedBuilder()
            .setColor("#0598F6")
            .setFooter({text: `Requested by ${interaction.user.username} | Type: Random | ID: ${randomNever}`, iconURL: interaction.user.avatarURL()})
            .setFooter({text: client.translation.get(guildDb?.language, 'Debug.embed.isChannel', {
                is: interaction?.channel?.id == guildDb?.dailyChannel ? client.translation.get(guildDb?.language, 'Debug.embed.is') : client.translation.get(guildDb?.language, 'Debug.embed.isnot')})})
            .setDescription(neverArray[randomNever]);

        const row = new ActionRowBuilder();
        if (Math.round(Math.random() * 15) < 3) {
            row.addComponents([
                new ButtonBuilder()
                    .setLabel('Invite')
                    .setStyle(5)
                    .setEmoji('1009964111045607525')
                    .setURL(
                        'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands',
                    )
            ]);
        }
        row.addComponents([
            new ButtonBuilder()
                .setLabel('New Question')
                .setStyle(1)
                .setEmoji('1073954835533156402')
                .setCustomId(`neverhaveiever`)
        ]);

        return interaction.update({
            embeds: [ratherembed],
            components: [row],
        }).catch((err) => {
            return;
        });
    },
};
