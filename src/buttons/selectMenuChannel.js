const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'selectMenuChannel',
        description: 'Select Menu Channel',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = await require(`../languages/${guildDb.language}.json`);
        const newChannel = interaction.values[0];
        const dailyMsgs = new EmbedBuilder()
            .setTitle(Settings.embed.dailyTitle)
            .setDescription(`${Settings.embed.dailyMsg}: ${guildDb.dailyMsg ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyChannel}: <#${newChannel}>\n${Settings.embed.dailyRole}: ${guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyTimezone}: ${guildDb.dailyTimezone}\n`)
            .setColor("#0598F6")
            .setFooter({ text: Settings.embed.footer, iconUrl: client.user.avatarURL() })

        const dailyButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("dailyMsg")
                    .setLabel(Settings.button.dailyMsg)
                    .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
                new ButtonBuilder()
                    .setCustomId("dailyChannel")
                    .setLabel(Settings.button.dailyChannel)
                    .setStyle("Success"),
            ), dailyButtons2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("dailyTimezone")
                        .setLabel(Settings.button.dailyTimezone)
                        .setStyle("Primary")
                        .setEmoji("🌍"),
                    new ButtonBuilder()
                        .setCustomId("dailyRole")
                        .setLabel(Settings.button.dailyRole)
                        .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
                )

        await client.database.updateGuild(interaction.guild.id, {
            dailyChannel: newChannel
        });

        return interaction.update({ content: null, embeds: [dailyMsgs], components: [dailyButtons, dailyButtons2], ephemeral: true });
    },
};
