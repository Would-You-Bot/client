const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    AttachmentBuilder
} = require('discord.js');
const {ChalkAdvanced} = require("chalk-advanced");
const CronJob = require('cron').CronJob;
const voteSchema = require('../util/Models/voteModel');
const QuickChart = require('quickchart-js');

const chart = new QuickChart();
chart.setWidth(750)
chart.setHeight(750);
chart.setBackgroundColor('#2F3136');
chart.setVersion('2');

const Either = require('./generateEither');

module.exports = class Voting {
    constructor(c) {
        this.c = c;
        this._cache = new Map();
    }

    async saveVoting({
                         guildId,
                         type = 0,
                         until,
                         channelId,
                         op_one,
                         op_tow
                     }) {
        const randomId = (new Date().getTime()).toString(36) + `${Math.random().toString(36).substring(2, 9)}`;

        const vote = new voteSchema({
            id: randomId,
            guildId: guildId,
            channelId: channelId,
            type: type,
            until: until,
            texts: {
                1: op_one,
                2: op_tow
            }
        });
        await vote.save();

        this._cache.set(randomId, vote);

        return randomId;
    }


    async generateVoting(guildId = null, channelId = null, until = 0, type = 0, op_one, op_tow) {
        let g;
        if (guildId !== null && typeof guildId === 'string') g = this.c.database.getGuild(String(guildId));

        const voteId = await this.saveVoting({
            guildId,
            channelId,
            until,
            type,
            op_one,
            op_tow
        });

        const row = new ActionRowBuilder();
        switch (type) {
            case 0:
                row.addComponents([
                    new ButtonBuilder()
                        .setCustomId(`votingplaceholder`)
                        .setLabel('Vote: ')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`voting_${voteId}_1`)
                        .setEmoji('1️⃣')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`voting_${voteId}_2`)
                        .setEmoji('2️⃣')
                        .setStyle(ButtonStyle.Primary),
                ]);
                break;
            case 1:
                row.addComponents([
                    new ButtonBuilder()
                        .setCustomId(`votingplaceholder`)
                        .setLabel(this.c.translation.get(g?.language ?? 'en_EN', 'Voting.Vote'))
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`voting_${voteId}_1`)
                        .setLabel(op_one ?? this.c.translation.get(g?.language ?? 'en_EN', 'Voting.Yes'))
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`voting_${voteId}_2`)
                        .setLabel(op_tow ?? this.c.translation.get(g?.language ?? 'en_EN', 'Voting.No'))
                        .setStyle(ButtonStyle.Primary),
                ]);
                break;
        }

        return {
            row,
            id: voteId
        };
    }

    getVoting(id) {
        return this._cache.get(id);
    }

    async deleteVoting(id) {
        await voteSchema.deleteOne({
            id: id,
        });

        this._cache.delete(id);
    }

    async addVote(id, userId, option = 1) {
        const vote = this.getVoting(id);
        if (!vote) return false;

        const options = [1, 2];
        for (const o of options) {
            vote.options[o] = vote.options[o].filter(u => u !== userId);
        }

        vote.options[option].push(userId);

        this._cache.set(id, vote);
        await vote.save();

        return true;
    }

    async getVotingResults(id) {
        const vote = this.getVoting(id);
        if (!vote) return false;

        let g;
        if (vote.guildId !== null && typeof vote.guildId === 'string') g = this.c.database.getGuild(String(vote.guildId));

        const all_votes = Number(vote.options[1]?.length + vote.options[2]?.length);
        const option_1 = Number(vote.options[1]?.length);
        const option_2 = Number(vote.options[2]?.length);

        const chartData = Object.keys(vote.options).map(e => Number(vote.options[`${e}`].length));
        const chartLabels = Object.keys(vote.options).map(e => '#' + e);

        chart.setConfig({
            "type": "outlabeledPie",
            "data": {
                "labels": chartLabels,
                "datasets": [{
                    "backgroundColor": ['#f00404', '#0091ff'],
                    "data": chartData
                }]
            },
            "options": {
                "plugins": {
                    "legend": false,
                    "outlabels": {
                        "text": "%l %p",
                        "color": "white",
                        "stretch": 35,
                        "font": {
                            "resizable": true,
                            "minSize": 12,
                            "maxSize": 18
                        }
                    }
                }
            }
        });

        // let e;
        // if (vote.type === 0) {
        //     e = new Either()
        //         .setLanguage(g?.language ?? 'en_EN')
        //         .addFirstText(vote.texts[1])
        //         .addSecondText(vote.texts[2])
        //         .setVotes(vote.options[1], vote.options[2]);
        // }

        return {
            all_votes,
            option_1,
            option_2,
            chart: chart.getUrl(),
            //image: vote.type === 0 ? await e.build() : null,
        };
    }

    async endVoting(id, messageId) {
        const vote = this.getVoting(id);
        if (!vote) return false;

        const results = await this.getVotingResults(id);

        let g;
        if (vote.guildId !== null && typeof vote.guildId === 'string') g = this.c.database.getGuild(String(vote.guildId));

        const embed = new EmbedBuilder()
            .setTitle(this.c.translation.get(g?.language ?? 'en_EN', 'Voting.VotingResults'))
            .setColor("#0598F6")
            .setImage(results.chart);

        // let attachment = null;
        // if (vote.type === 0) {
        //     attachment = new AttachmentBuilder(results.image, {
        //         name: 'voting.png'
        //     });
        //     embed.setImage('attachment://voting.png');
        // }

        const channel = await this.c.channels.fetch(vote.channelId).catch(err => {
        });

        if (!channel?.permissionsFor(this.c?.user?.id).has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])) return {
            error: 'no_permissions'
        };

        const message = await channel.messages.fetch(messageId).catch(err => {
            console.log(err)
        });

        if (!message || !message.id) return {
            error: 'message_not_found'
        };

        const row = ActionRowBuilder.from(message.components[1]);

        await message.edit({
            embeds: [embed.setDescription(message.embeds[0].description)],
            components: [row],
        }).catch(err => {
            console.log(err);
        });

        await this.deleteVoting(id);

        return true;
    }

    /**
     * Start the daily message Schedule
     */
    start() {
        new CronJob('0 */2 * * * *', async () => {
            await this.runSchedule();
        }, null, true, "Europe/Berlin");
    }

    /**
     * Run the daily message schedule
     * @return {Promise<void>}
     */
    async runSchedule() {
        let votes = await voteSchema.find().lean();
        votes = [...votes].filter(v => v.until <= ~~(Date.now() / 1000) && v.until !== 0);

        for (const vote of votes) {
            await this.endVoting(vote.id, vote.messageId);
        }

        console.log(
            `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
                '>',
            )} ${ChalkAdvanced.green('Voting Schedule done.')}`,
        );
    }
};
