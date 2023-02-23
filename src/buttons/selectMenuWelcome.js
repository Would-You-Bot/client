const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'seletcMenuWelcome',
        description: 'Select Menu Welcome',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = await require(`../languages/${guildDb.language}.json`);
        const newChannel = interaction.values[0];

        const welcomes = new EmbedBuilder()
            .setTitle(Settings.embed.welcomeTitle)
            .setDescription(`${Settings.embed.welcome}: ${guildDb.welcome ? `<:check:1077962440815411241>` : `<:BadCheck:1025495596968198175>`}\n${Settings.embed.welcomePing}: ${guildDb.welcomePing ? `<:check:1077962440815411241>` : `<:BadCheck:1025495596968198175>`}\n${Settings.embed.welcomeChannel}: <#${newChannel}>`)
            .setColor("#0598F6")
            .setFooter({ text: Settings.embed.footer, iconURL: client.user.avatarURL(), })

        const welcomeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("welcome")
                    .setLabel(Settings.button.welcome)
                    .setStyle(guildDb.welcome ? "Success" : "Secondary"),
                new ButtonBuilder()
                    .setCustomId("welcomeChannel")
                    .setLabel(Settings.button.welcomeChannel)
                    .setStyle("Success"),
            ), welcomeButtons2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("welcomePing")
                        .setLabel(Settings.button.welcomePing)
                        .setStyle(guildDb.welcomePing ? "Success" : "Secondary"),
                )

        await client.database.updateGuild(interaction.guild.id, {
            welcomeChannel: newChannel
        });

        return interaction.update({ content: null, embeds: [welcomes], components: [welcomeButtons, welcomeButtons2], ephemeral: true });
    },
};
