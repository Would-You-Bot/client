const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    SlashCommandBuilder
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command!')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: "Hilfe Befehl!",
            "es-ES": 'Comando de ayuda!'
        }),
    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const languageMappings = {
            de_DE: "de",
            en_EN: "en",
            es_ES: "es"
        };

        const commands = await client.application.commands.fetch({ withLocalizations: true });
        const type = languageMappings[guildDb?.language] || "en";

        const helpEmbed = new MessageEmbed()
            .setColor('#0598F6')
            .setFooter({
                text: client.translation.get(guildDb?.language, 'Help.embed.footer'),
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .setTitle(client.translation.get(guildDb?.language, 'Help.embed.title'))
            .addFields({
                name: client.translation.get(guildDb?.language, 'Help.embed.Fields.privacyname'),
                value: client.translation.get(guildDb?.language, 'Help.embed.Fields.privacy'),
                inline: false,
            })
            .setDescription(client.translation.get(guildDb?.language, 'Help.embed.description') + `\n\n${commands
                .filter(e => e.name !== "reload")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(n => `</${n.name}:${n.id}> - ${type === "de" ? n.descriptionLocalizations.de : type === "es" ? n.descriptionLocalizations["es-ES"] : n.description}`)
                .join("\n")}`);

        const inviteButtonLabel = client.translation.get(guildDb?.language, 'Help.button.title');
        const inviteButtonURL = 'https://discord.gg/vMyXAxEznS';
        const inviteButton = new MessageButton()
            .setLabel(inviteButtonLabel)
            .setStyle('LINK')
            .setEmoji('💫')
            .setURL(inviteButtonURL);

        const addButtonLabel = 'Invite';
        const addButtonURL = 'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands';
        const addButton = new MessageButton()
            .setLabel(addButtonLabel)
            .setStyle('LINK')
            .setEmoji('1009964111045607525')
            .setURL(addButtonURL);

        const actionRow = new MessageActionRow().addComponents(inviteButton, addButton);

        await interaction.reply({
            embeds: [helpEmbed],
            components: [actionRow],
        });
    },
};
