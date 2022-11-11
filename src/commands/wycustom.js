const {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const axios = require('axios');
const guildLang = require('../util/Models/guildModel');

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
                        .setDescription("Input a message to create a custom WouldYou message.")
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
     */

    async execute(interaction, client) {
        let typeEmbed;
        guildLang
            .findOne({ guildID: interaction.guild.id })
            .then(async (result) => {
                const { Language, wyCustom } = require(`../languages/${result.language}.json`);
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
                        case 'add': {
                            if (await api.hasVoted(interaction.user.id) == false) {
                                if (result.customMessages.length >= 30) return await interaction.reply({ ephemeral: true, content: wyCustom.error.maximum })
                            }
                            let newID = makeID(6);
                            typeEmbed = new EmbedBuilder()
                                .setTitle(wyCustom.success.embedAdd.title)
                                .setDescription(`**${wyCustom.success.embedAdd.descID}**: ${newID}\n**${wyCustom.success.embedAdd.descCat}**: ${interaction.options.getString("options").toLowerCase()}\n\n**${wyCustom.success.embedAdd.descCont}**: \`${interaction.options.getString("message")}\``)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });

                            result.customMessages.push({ id: newID, msg: interaction.options.getString("message"), type: interaction.options.getString("options").toLowerCase() })
                            await result.save()
                            break;
                        }

                        case 'remove': {
                            typeEmbed = new EmbedBuilder()
                                .setTitle(wyCustom.success.embedRemove.title)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });

                            if (!result.customMessages.find(c => c.id.toString() === interaction.options.getString("message").toString())) return await interaction.reply({ ephemeral: true, content: "There is no custom WouldYou message with that ID!" })
                            let filtered = result.customMessages.filter(c => c.id.toString() != interaction.options.getString("message").toString())
                            result.customMessages = filtered
                            await result.save()
                            break;
                        }

                        case 'view': {
                            if (result.customMessages.length === 0) return await interaction.reply({ ephemeral: true, content: wyCustom.error.empty })

                            const page = new Paginator([], {})

                            if (result.customMessages.filter(c => c.type === "nsfw" > 0)) {
                                let data;
                                data = result.customMessages.filter(c => c.type === "nsfw").map(
                                    (s, i) =>
                                        `${wyCustom.success.embedAdd.descID}: ${s.id}\n${wyCustom.success.embedAdd.descMsg}: ${s.msg}`
                                );
                                data = Array.from({
                                    length: Math.ceil(data.length / 5)
                                },
                                    (a, r) => data.slice(r * 5, r * 5 + 5)
                                );

                                Math.ceil(data.length / 5);
                                data = data.map(e => page.add(new EmbedBuilder().setTitle(wyCustom.success.paginator.title).setDescription(`${wyCustom.success.paginator.descCatNSFW}\n\n${e.slice(0, 5).join("\n\n").toString()}`)))
                            }

                            if (result.customMessages.filter(c => c.type === "useless" > 0)) {
                                let data;
                                data = result.customMessages.filter(c => c.type === "useless").map(
                                    (s, i) =>
                                        `${wyCustom.success.embedAdd.descID}: ${s.id}\n${wyCustom.success.embedAdd.descMsg}: ${s.msg}`
                                );
                                data = Array.from({
                                    length: Math.ceil(data.length / 5)
                                },
                                    (a, r) => data.slice(r * 5, r * 5 + 5)
                                );

                                Math.ceil(data.length / 5);
                                data = data.map(e => page.add(new EmbedBuilder().setTitle(wyCustom.success.paginator.title).setDescription(`${wyCustom.success.paginator.descCatUseful}\n\n${e.slice(0, 5).join("\n\n").toString()}`)))
                            }

                            if (result.customMessages.filter(c => c.type === "useful" > 0)) {
                                let data;
                                data = result.customMessages.filter(c => c.type === "useful").map(
                                    (s, i) =>
                                        `${wyCustom.success.embedAdd.descID}: ${s.id}\n${wyCustom.success.embedAdd.descMsg}: ${s.msg}`
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
                        }

                        case 'import': {
                            if (!interaction.options.get("attachment")) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att1 })
                            if (!interaction.options.get("attachment").attachment.name.includes(".json")) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att2 })
                            axios.get(interaction.options.get("attachment").attachment.url, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then(async response => {
                                    if (response.data.length === 0) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att3 })
                                    if (!response.data.useless && !response.data.useful && !response.data.nsfw) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att4 })
                                    if (!response.data.useless.length === 0 && !response.data.useful.length === 0 && !response.data.nsfw.length === 0) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att5 })
                                    if (response.data.useless && response.data.useless.length > 30 && await api.hasVoted(interaction.user.id) == false) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att6 })
                                    if (response.data.useful && response.data.useful.length > 30 && await api.hasVoted(interaction.user.id) == false) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att7 })
                                    if (response.data.nsfw && response.data.nsfw.length > 30 && await api.hasVoted(interaction.user.id) == false) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att8 })

                                    let useful = result.customMessages.filter(c => c.type === "useful").length;
                                    let useless = result.customMessages.filter(c => c.type === "useless").length;
                                    let nsfw = result.customMessages.filter(c => c.type === "nsfw").length
                                    if (useful > 30) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att9 })
                                    if (useless > 30) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att10 })
                                    if (nsfw > 30) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att11 })

                                    if (response.data.useful) {
                                        if (response.data.useful.length + useful > 30 && await api.hasVoted(interaction.user.id) == false) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att12 })
                                        response.data.useful.map(d => { let newID = makeID(6); result.customMessages.push({ id: newID, msg: d, type: "useful" }) });
                                    }

                                    if (response.data.useless) {
                                        if (response.data.useless.length + useless > 30 && await api.hasVoted(interaction.user.id) == false) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att13 })
                                        response.data.useless.map(d => { let newID = makeID(6); result.customMessages.push({ id: newID, msg: d, type: "useless" }) });
                                    }

                                    if (response.data.nsfw) {
                                        if (response.data.nsfw.length + nsfw > 30 && await api.hasVoted(interaction.user.id) == false) return await interaction.reply({ ephemeral: true, content: wyCustom.error.import.att14 })
                                        response.data.nsfw.map(d => { let newID = makeID(6); result.customMessages.push({ id: newID, msg: d, type: "nsfw" }) });
                                    }
                                    await result.save()

                                    return await interaction.reply({ ephemeral: true, content: wyCustom.success.import })
                                }).catch((e) => { return interaction.reply(`${wyCustom.error.import.att15}\n\nError: ${e}`) })
                            break;
                        }

                        case "export": {
                            if (result.customMessages.length === 0) return await interaction.reply({ ephemeral: true, content: wyCustom.error.export.none })
                            let useful = result.customMessages.filter(c => c.type === "useful");
                            let useless = result.customMessages.filter(c => c.type === "useless");
                            let nsfw = result.customMessages.filter(c => c.type === "nsfw");

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
                                text += `\n]${nsfw.length > 0 ? "," : ""}`
                            }

                            if (nsfw.length > 0) {
                                text += `\n"nsfw": [`
                                nsfw.map((a, i) => {
                                    i = i++ + 1
                                    text += `\n"${a.msg}"${nsfw.length !== i ? "," : ""}`
                                })
                                text += `\n]`
                            }
                            text += `\n}`

                            return await interaction.reply({
                                content: wyCustom.success.export,
                                files: [{
                                    attachment: Buffer.from(text),
                                    name: `Custom_Messages_${interaction.guild.id}.json`
                                }]
                            })
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
