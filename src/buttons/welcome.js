const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'welcome',
        description: 'Toggle Welcome Message',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = await require(`../languages/${guildDb.language}.json`);
        const check = guildDb.welcome;

        const welcomes = new EmbedBuilder()
            .setTitle(Settings.embed.welcomeTitle)
            .setDescription(`${Settings.embed.welcome}: ${check ? `<:x_:1077962443013238814>` : `<:check:1077962440815411241>`}\n${Settings.embed.welcomePing}: ${guildDb.welcomePing ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n${Settings.embed.welcomeChannel}: ${guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : `<:x_:1077962443013238814>`}`)
            .setColor("#0598F6")
            .setFooter({ text: Settings.embed.footer, iconURL: client.user.avatarURL(), })

        const welcomeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("welcome")
                    .setLabel(Settings.button.welcome)
                    .setStyle(check ? "Secondary" : "Success"),
                new ButtonBuilder()
                    .setCustomId("welcomeChannel")
                    .setLabel(Settings.button.welcomeChannel)
                    .setStyle(guildDb.welcomeChannel ? "Success" : "Secondary"),
            ), welcomeButtons2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("welcomePing")
                        .setLabel(Settings.button.welcomePing)
                        .setStyle(guildDb.welcomePing ? "Success" : "Secondary"),
                )

        await client.database.updateGuild(interaction.guild.id, {
            welcome: check ? false : true
        });

        return interaction.update({ content: null, embeds: [welcomes], components: [welcomeButtons, welcomeButtons2], ephemeral: true });
    },
};
