const guildcreate = require('../util/Models/guildModel');
module.exports = async (client, interaction) => {
    if (!interaction.guild) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            if (command?.requireGuild) return interaction.reply({
                content: "This command is only usable on a Discord Server!\nYou want to test WouldYou? Join the support server!\nhttps://discord.gg/vMyXAxEznS",
                ephemeral: true,
            });

            try {
                command.execute(interaction, client, null);
            } catch (err) {
                if (err) console.error(err);
                return interaction.reply({
                    content: "An error occurred while trying to execute that command.",
                    ephemeral: true,
                });
            }
        }
        ;
    } else {
        const guildDb = await client.database.getGuild(interaction.guild.id, true);

        // const { inter } = require(`../languages/${guildDb.language || "en_EN"}.json`);
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                command.execute(interaction, client, guildDb);
            } catch (err) {
                if (err) console.error(err);
                interaction.reply({
                    content: "An error occurred while trying to execute that command.",
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            if (client.used.has(interaction.user.id)) {
                return await interaction.reply({
                    ephemeral: true,
                    content: `<t:${Math.floor(guildDb.replayCooldown / 1000 + Date.now() / 1000)}:R> you can use buttons again!`
                }).catch(() => {
                });
            }

            const button = client.buttons.get(interaction.customId);
            if (!button) return interaction.reply({
                content: "Please use the command again.",
                ephemeral: true
            }).catch(() => {
            });

            try {
                client.used.set(interaction.user.id, Date.now() + guildDb.replayCooldown)
                setTimeout(() => client.used.delete(interaction.user.id), guildDb.replayCooldown)

                return button.execute(interaction, client, guildDb);
            } catch (err) {
                if (err) console.error(err);
                return interaction.reply({
                    content: "An error occurred while trying to execute that command.",
                    ephemeral: true,
                });
            }
        }
    }
}
