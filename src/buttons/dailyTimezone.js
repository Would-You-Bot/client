const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const modalObject = {
    title: 'Daily Message Timezone',
    custom_id: 'modal',
    components: [{
        type: 1,
        components: [{
            type: 4,
            style: 1,
            custom_id: 'input',
            label: 'Provide a timezone',

        }]
    }]
}

function isValid(tz) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        return false;
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch (ex) {
        return false;
    }
}

function dateType(tz) {
    if (!tz.includes("/")) return false;
    let text = tz.split("/");

    if (text.length === 2) return true
    else return false;
}

module.exports = {
    data: {
        name: 'dailyTimezone',
        description: 'Daily Message Toggle',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = await require(`../languages/${guildDb.language}.json`);
        interaction.showModal(modalObject);
        interaction.awaitModalSubmit({
            filter: (mInter) => mInter.customId === modalObject.custom_id,
            time: 60000,
        }).then(async (modalInteraction) => {
            const value = modalInteraction.components[0].components[0].value;

            if (guildDb.dailyTimezone.toLowerCase() === value.toLowerCase()) return modalInteraction.reply({
                ephemeral: true,
                content: Settings.errorSame
            });
            if (!isValid(value)) return modalInteraction.reply({
                ephemeral: true,
                content: Settings.errorInvalid
            });
            if (!dateType(value)) return modalInteraction.reply({
                ephemeral: true,
                content: Settings.errorInvalid
            });

            const dailyMsgs = new EmbedBuilder()
                .setTitle(Settings.embed.dailyTitle)
                .setDescription(`${Settings.embed.dailyMsg}: ${guildDb.dailyMsg ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyChannel}: ${guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyRole}: ${guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : `<:x_:1077962443013238814>`}\n${Settings.embed.dailyTimezone}: ${value}\n`)
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
                            .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
                    )

            await client.database.updateGuild(interaction.guild.id, {
                dailyTimezone: value
            });

            return modalInteraction.update({ content: null, embeds: [dailyMsgs], components: [dailyButtons, dailyButtons2], ephemeral: true });
        })
    },
};
