const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'selectMenuRole',
        description: 'Select Menu Role',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = await require(`../languages/${guildDb.language}.json`);
        const newRole = interaction.values[0];
        const dailyMsgs = new EmbedBuilder()
            .setTitle(Settings.embed.dailyTitle)
            .setDescription(`${Settings.embed.dailyMsg}: ${guildDb.dailyMsg ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyChannel}: ${guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyRole}: <@&${newRole}>\n${Settings.embed.dailyTimezone}: ${guildDb.dailyTimezone}\n`)
            .setColor("#0598F6")


        const dailyButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("dailyMsg")
                    .setLabel(Settings.button.dailyMsg)
                    .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
                new ButtonBuilder()
                    .setCustomId("dailyChannel")
                    .setLabel(Settings.button.dailyChannel)
                    .setStyle(guildDb.dailyChannel ? "Success" : "Secondary"),
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
                        .setStyle("Success"),
                )

        await client.database.updateGuild(interaction.guild.id, {
            dailyRole: newRole
        });

        return interaction.update({ content: null, embeds: [dailyMsgs], components: [dailyButtons, dailyButtons2], ephemeral: true });
    },
};
