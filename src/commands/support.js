const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const guildModel = require("../util/Models/guildModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Link to our support server")
        .setDMPermission(true)
        .setDescriptionLocalizations({
            de: "Link zu unserem Support Server",
            "es-ES": "Link para nuestro servidor de soporte",
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        let language = require(`../languages/en_EN.json`);
        if (interaction.guildId) {
            language = require(`../languages/${guildDb.language}.json`);
        }
        const {Support} = language;

        const supportembed = new EmbedBuilder()
            .setColor("#F00505")
            .setTitle(Support.embed.title)
            .setDescription(`${Support.embed.description}`)
            .setFooter({
                text: `${Support.embed.footer}`,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp();

        const supportbutton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(5)
                .setEmoji("💻")
                .setURL("https://discord.gg/vMyXAxEznS")
        );

        return interaction
            .reply({
                embeds: [supportembed],
                components: [supportbutton],
            })
            .catch((err) => {
                return;
            });
    },
};
