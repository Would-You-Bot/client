const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');
function makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('wycustom')
        .setDescription('Adds custom WouldYou messages.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Adds a custom message")
                .addStringOption((option) =>
                    option
                        .setName("options")
                        .setDescription("Select which category you want this custom message to be in.")
                        .setRequired(true)
                        .addChoices(
                            { name: 'Useful', value: 'useful' },
                            { name: 'NSFW', value: 'nsfw' },
                            { name: 'Useless', value: 'useless' },
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("Input a message for to create a custom WouldYou message.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("Removes a custom message")
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("Input a custom WouldYou ID number to remove it.")
                        .setRequired(true)
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("view")
                .setDescription("Views all of your custom WouldYou messages")
        ),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        let typeEmbed;
        guildLang
            .findOne({ guildID: interaction.guild.id })
            .then(async (result) => {
                const { Language } = require(`../languages/${result.language}.json`);
                if (
                    interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
                ) {
                    switch (interaction.options.getSubcommand()) {
                        case 'add': {
                            let array = ["useless", "nsfw", "useful"]; // This is probably not needed but oh well
                            if (!array.find(c => c === interaction.options.getString("options").toLowerCase())) return await interaction.reply({ ephemeral: true, content: "You need to provide which category you want it in. Options: \`useful\` | \`nsfw\` | \`useless\`" })
                            let db = await guildLang.findOne({ guildID: interaction.guild.id });
                            if (db.customMessages.length >= 30) return await interaction.reply({ ephemeral: true, content: "You've reached the maximum amount of custom messages. You can gain more using our premium plan." })
                            let newID = makeID(6);
                            typeEmbed = new EmbedBuilder()
                                .setTitle('Successfully created that WouldYou message!')
                                .setDescription(`**ID**: ${newID}\n**Category**: ${interaction.options.getString("options").toLowerCase()}\n\n**Content**: \`${interaction.options.getString("message")}\``)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });

                            db.customMessages.push({ id: newID, msg: interaction.options.getString("message"), type: interaction.options.getString("options").toLowerCase() })
                            await db.save()
                            break;
                        }

                        case 'remove': {
                            typeEmbed = new EmbedBuilder()
                                .setTitle('Successfully removed that custom WouldYou message!')
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });

                            let db = await guildLang.findOne({ guildID: interaction.guild.id })
                            if (!db.customMessages.find(c => c.id.toString() === interaction.options.getString("message").toString())) return await interaction.reply({ ephemeral: true, content: "There is no custom WouldYou message with that ID!" })
                            let filtered = db.customMessages.filter(c => c.id.toString() != interaction.options.getString("message").toString())
                            db.customMessages = filtered
                            await db.save()
                            break;
                        }

                        case 'view': {
                            let db = await guildLang.findOne({ guildID: interaction.guild.id })
                            if (db.customMessages.length === 0) return await interaction.reply({ ephemeral: true, content: "There currently is no custom WouldYou messages to view!" })

                            typeEmbed = new EmbedBuilder()
                                .setTitle('WouldYou Custom Messages')
                                .setDescription(`${db.customMessages.map(c => `**ID**: ${c.id}\n**Category**: ${c.type}\n**Message**: ${c.msg}`).join("\n\n")}`)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }
                    }

                    await interaction.reply({
                        embeds: [typeEmbed],
                        ephemeral: true,
                    }).catch((err) => { return; });
                } else {
                    const errorembed = new EmbedBuilder()
                        .setColor('#F00505')
                        .setTitle('Error!')
                        .setDescription(Language.embed.error);
                    await interaction.reply({
                        embeds: [errorembed],
                        ephemeral: true,
                    }).catch((err) => { return; });
                }
            });
    },
};
