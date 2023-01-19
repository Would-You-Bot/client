const {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const axios = require('axios');
const guildModel = require('../util/Models/guildModel');

require("dotenv").config();

const Topgg = require(`@top-gg/sdk`)

const api = new Topgg.Api(process.env.TOPGGTOKEN)

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
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('wycustom')
        .setDescription('Adds custom WouldYou messages.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Fügt eigene WouldYou Fragen hinzu.',
            "es-ES": 'Añade mensajes Would You personalizados.'
        })
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
                            {name: 'Useful', value: 'useful'},
                            {name: 'Useless', value: 'useless'},
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("Input a message to create a custom WouldYou message.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("Removes a custom message.")
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("Input a custom WouldYou ID number to remove it.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("removeall")
                .setDescription("Removes all custom messages.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("view")
                .setDescription("Views all of your custom WouldYou messages")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("import")
                .setDescription("Imports custom messages from a JSON file.")
                .addAttachmentOption(option => option.setName('attachment').setDescription('Import a JSON file containing useless or useful Would You custom messages.').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("export")
                .setDescription("Exports custom messages into a JSON file.")
        ),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        let typeEmbed, message;
        const {Language, wyCustom} = require(`../languages/${guildDb.language}.json`);


        class Paginator {
            constructor(pages = [], {
                filter,
                timeout
            } = {
                timeout: 5 * 6e4
            }) {
                this.pages = Array.isArray(pages) ? pages : [];
                this.timeout = Number(timeout) || 5 * 6e4;
                this.page = 0;
            }

            add(page) {
                this.pages.push(page);
                return this;
            }

            setEndPage(page) {
                if (page) this.endPage = page;
                return this;
            }

            setTransform(fn) {
                const _pages = [];
                let i = 0;
                const ln = this.pages.length;
                for (const page of this.pages) {
                    _pages.push(fn(page, i, ln));
                    i++;
                }
                this.pages = _pages;
                return this;
            }

            async start(channel, buttons) {
                if (!this.pages.length) return;
                const msg = await channel.reply({
                    embeds: [this.pages[0]],
                    components: [buttons],
                    ephemeral: true
                });
                const collector = msg.createMessageComponentCollector();

                collector.on('collect', async (inter) => {
                    try {
                        if (inter.isButton()) {
                            if (!inter) return;

                            switch (inter.customId) {
                                case "first":
                                    if (this.page === 0) {
                                        return await inter.reply({
                                            ephemeral: true,
                                            content: wyCustom.error.paginate
                                        });
                                    } else {
                                        await inter.update({
                                            embeds: [this.pages[0]],
                                            ephemeral: true
                                        });
                                        return this.page = 0;
                                    }
                                case "prev":
                                    if (this.pages[this.page - 1]) {
                                        return await inter.update({
                                            embeds: [this.pages[--this.page]],
                                            ephemeral: true
                                        });
                                    } else {
                                        return await inter.reply({
                                            ephemeral: true,
                                            content: wyCustom.error.paginate
                                        });
                                    }
                                case "next":
                                    if (this.pages[this.page + 1]) {
                                        return await inter.update({
                                            embeds: [this.pages[++this.page]],
                                            ephemeral: true
                                        });
                                    } else {
                                        return await inter.reply({
                                            ephemeral: true,
                                            content: wyCustom.error.paginate
                                        });
                                    }
                                case "last":
                                    if (this.page === this.pages.length - 1) {
                                        return await inter.reply({
                                            ephemeral: true,
                                            content: wyCustom.error.paginate
                                        });
                                    } else {
                                        await inter.update({
                                            embeds: [this.pages[this.pages.length - 1]],
                                            ephemeral: true
                                        });
                                        return this.page = this.pages.length - 1;
                                    }
                            }
                        }
                    } catch (e) {
                        return;
                    }
                });
            }
        }
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            switch (interaction.options.getSubcommand()) {
                case 'add':
                    if (await api.hasVoted(interaction.user.id) == false) {
                        if (guildDb.customMessages.length >= 30) return interaction.reply({
                            ephemeral: true,
                            content: wyCustom.error.maximum
                        })
                    }

                    const option = interaction.options.getString("options").toLowerCase();
                    message = interaction.options.getString("message");

                    let newID = makeID(6);
                    typeEmbed = new EmbedBuilder()
                        .setTitle(wyCustom.success.embed.title)
                        .setColor("#0598F4")
                        .setDescription(`**${wyCustom.success.embedAdd.descID}**: ${newID}\n**${wyCustom.success.embedAdd.descCat}**: ${option}\n\n**${wyCustom.success.embedAdd.descCont}**: \`${message}\``)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });

                    guildDb.customMessages.push({
                        id: newID,
                        msg: message,
                        type:option
                    })

                    await client.database.updateGuild(interaction.guildId, {
                        customMessages: guildDb.customMessages,
                    }, true);
                    break;
                case 'remove':
                    message = interaction.options.getString("message");

                    typeEmbed = new EmbedBuilder()
                        .setTitle(wyCustom.success.embedRemove.title)
                        .setColor("#0598F4")
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });

                    if (!guildDb.customMessages.find(c => c.id.toString() === message)) return interaction.reply({
                        ephemeral: true,
                        content: "There is no custom WouldYou message with that ID!"
                    })
                    let filtered = guildDb.customMessages.filter(c => c.id.toString() != message);

                    await client.database.updateGuild(interaction.guildId, {
                        customMessages: filtered,
                    }, true);
                    break;
                case 'removeall':
                    if (guildDb.customMessages.length === 0) return interaction.reply({
                        content: wyCustom.success.embedRemoveAll.none,
                        ephemeral: true
                    })

                    typeEmbed = new EmbedBuilder()
                        .setTitle(wyCustom.success.embedRemoveAll.title)
                        .setColor("#0598F4")
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });

                    const button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('Accept')
                            .setStyle(4)
                            .setCustomId('wycustom_accept'),
                        new ButtonBuilder()
                            .setLabel('Decline')
                            .setStyle(2)
                            .setCustomId('wycustom_decline'),
                    );

                    interaction.reply({embeds: [typeEmbed], components: [button], ephemeral: true})
                    break;
                case 'view':
                    if (guildDb.customMessages.length === 0) return interaction.reply({
                        ephemeral: true,
                        content: wyCustom.error.empty
                    })

                    const page = new Paginator([], {})

                    if (guildDb.customMessages.filter(c => c.type === "useless" > 0)) {
                        let data;
                        data = guildDb.customMessages.filter(c => c.type === "useless").map(
                            (s, i) =>
                                `${wyCustom.success.embed.descID}: ${s.id}\n${wyCustom.success.embed.descMsg}: ${s.msg}`
                        );
                        data = Array.from({
                                length: Math.ceil(data.length / 5)
                            },
                            (a, r) => data.slice(r * 5, r * 5 + 5)
                        );

                        Math.ceil(data.length / 5);
                        data = data.map(e => page.add(new EmbedBuilder().setTitle(wyCustom.success.paginator.title).setDescription(`${wyCustom.success.paginator.descCatUseful}\n\n${e.slice(0, 5).join("\n\n").toString()}`)))
                    }

                    if (guildDb.customMessages.filter(c => c.type === "useful" > 0)) {
                        let data;
                        data = guildDb.customMessages.filter(c => c.type === "useful").map(
                            (s, i) =>
                                `${wyCustom.success.embed.descID}: ${s.id}\n${wyCustom.success.embed.descMsg}: ${s.msg}`
                        );
                        data = Array.from({
                                length: Math.ceil(data.length / 5)
                            },
                            (a, r) => data.slice(r * 5, r * 5 + 5)
                        );

                        Math.ceil(data.length / 5);
                        data = data.map(e => page.add(new EmbedBuilder().setTitle(wyCustom.success.paginator.title).setDescription(`${wyCustom.success.paginator.descCatUseless}\n\n${e.slice(0, 5).join("\n\n").toString()}`)))
                    }

                    page.setTransform((embed, index, total) => embed.setFooter({
                        text: `Would You | Page ${index + 1} / ${total}`,
                        iconURL: client.user.avatarURL()
                    }))

                    const buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('first')
                                .setLabel('⏪')
                                .setStyle('Primary'),
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('◀️')
                                .setStyle('Success'),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('▶️')
                                .setStyle('Success'),
                            new ButtonBuilder()
                                .setCustomId('last')
                                .setLabel('⏩')
                                .setStyle('Primary'),
                        );

                    return page.start(interaction, buttons)
                case 'import':
                    const attachemnt = interaction.options.get("attachment");

                    if (!attachemnt) return await interaction.reply({
                        ephemeral: true,
                        content: wyCustom.error.import.att1
                    })
                    if (!attachemnt.attachment.name.includes(".json")) return await interaction.reply({
                        ephemeral: true,
                        content: wyCustom.error.import.att2
                    })

                    // Let give the bot some more time to fetch it :)
                    await interaction.deferReply({ ephemeral: tru });

                    axios
                        .get(attachemnt.attachment.url, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(async response => {
                            if (response.data.length === 0) return interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att3
                            })
                            if (!response.data.useless && !response.data.useful) return interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att4
                            })
                            if (!response.data.useless.length === 0 && !response.data.useful.length === 0) return interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att5
                            })
                            if (response.data.useless && response.data.useless.length > 30 & await api.hasVoted(interaction.user.id) == false) return interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att6
                            })
                            if (response.data.useful && response.data.useful.length > 30 & await api.hasVoted(interaction.user.id) == false) return interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att7
                            })

                            let useful = guildDb.customMessages.filter(c => c.type === "useful").length;
                            let useless = guildDb.customMessages.filter(c => c.type === "useless").length;
                            if (useful > 30) return await interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att9
                            })
                            if (useless > 30) return await interaction.editReply({
                                ephemeral: true,
                                content: wyCustom.error.import.att10
                            })

                            if (response.data.useful) {
                                if (response.data.useful.length + useful > 30 & await api.hasVoted(interaction.user.id) == false) return interaction.editReply({
                                    ephemeral: true,
                                    content: wyCustom.error.import.att12
                                })
                                response.data.useful.map(d => {
                                    let newID = makeID(6);
                                    guildDb.customMessages.push({id: newID, msg: d, type: "useful"})
                                });
                            }

                            if (response.data.useless) {
                                if (response.data.useless.length + useless > 30 & await api.hasVoted(interaction.user.id) == false) return interaction.editReply({
                                    ephemeral: true,
                                    content: wyCustom.error.import.att13
                                })
                                response.data.useless.map(d => {
                                    let newID = makeID(6);
                                    guildDb.customMessages.push({id: newID, msg: d, type: "useless"})
                                });
                            }

                            await client.database.updateGuild(interaction.guildId, {
                                customMessages: guildDb.customMessages,
                            }, true);

                            return interaction.editReply({ephemeral: true, content: wyCustom.success.import})
                        }).catch((e) => {
                        return interaction.editReply(`${wyCustom.error.import.att15}\n\nError: ${e}`)
                    })
                    break;
                case "export":
                    if (guildDb.customMessages.length === 0) return interaction.reply({
                        ephemeral: true,
                        content: wyCustom.error.export.none
                    })

                    await interaction.deferReply();

                    let useful = guildDb.customMessages.filter(c => c.type === "useful");
                    let useless = guildDb.customMessages.filter(c => c.type === "useless");

                    let text = `{\n`;
                    if (useful.length > 0) {
                        text += `"useful": [`
                        useful.map((a, i) => {
                            i = i++ + 1
                            text += `\n"${a.msg}"${useful.length !== i ? "," : ""}`
                        })
                        text += `\n]${useless.length > 0 ? "," : ""}`
                    }

                    if (useless.length > 0) {
                        text += `\n"useless": [`
                        useless.map((a, i) => {
                            i = i++ + 1
                            text += `\n"${a.msg}"${useless.length !== i ? "," : ""}`
                        })
                        text += `\n]`
                    }
                    text += `\n}`

                    return interaction.editReply({
                        content: wyCustom.success.export,
                        files: [{
                            attachment: Buffer.from(text),
                            name: `Custom_Messages_${interaction.guild.id}.json`
                        }]
                    })
            }

            return interaction.reply({
                embeds: [typeEmbed],
                ephemeral: true,
            }).catch((err) => {
                return;
            });
        } else {
            const errorembed = new EmbedBuilder()
                .setColor('#F00505')
                .setTitle('Error!')
                .setDescription(Language.embed.error);
            return interaction.reply({
                embeds: [errorembed],
                ephemeral: true,
            }).catch((err) => {
            });
        }
    },
};
