const { readdirSync } = require('fs');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    CachedManager,
} = require('discord.js');
const cat = readdirSync(`./src/commands/`).filter(d => d.endsWith('.js'));
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads slash commands.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Lädt slash commands neu.',
            "es-ES": 'Recargar los slash commands.'
        })
        .addStringOption((option) =>
            option
                .setName("options")
                .setDescription("Choose which command you want to reload.")
                .setRequired(true)
        ),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const users = ["268843733317976066", "347077478726238228", "834549048764661810"];
        if (!users.find(e => e === interaction.user.id)) return await interaction.reply({ ephemeral: true, content: "Only Would You develpers have access to this command! | Nur würden Sie-Entwickler Zugriff auf diesen Befehl haben!" })
        const cmd = interaction.options.getString("options");
        if (!cat.find(e => e.replace(".js", "") === cmd.toLowerCase())) return await interaction.reply({ ephemeral: true, content: "You must provide a valid command to reload it!" })

        try {
            delete require.cache[require.resolve(`./${cmd}.js`)];
            const pull = require(`./${cmd}.js`)
            client.commands.delete(cmd)
            client.commands.set(cmd, pull)
            await interaction.reply({ ephemeral: true, content: `Successfully reloaded command \`${cmd}\`!` })
        } catch (e) {
            await interaction.reply({ ephemeral: true, content: `Errored reloading command: \`${cmd}\`!\nError: ${e.message}` })
        }
    },
};
