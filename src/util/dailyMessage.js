const {EmbedBuilder} = require('discord.js');
const mom = require("moment-timezone");
const CronJob = require('cron').CronJob;

module.exports = class DailyMessage {
    constructor(c) {
        this.c = c;
    }

    /**
     * Start the daily message Schedule
     */
    start() {
        new CronJob('0 */60 * * * *', async () => {
            await this.runSchedule();
        });
    }

    /**
     * Run the daily message schedule
     * @return {Promise<void>}
     */
    async runSchedule() {
        const today = new Date();
        let guilds = await this.c.database.getAll();
        guilds = guilds.filter(g => this.c.guilds.cache.has(g.guildID) && g.dailyMsg && Number(g.dailyDay) !== today.getDay());

        let i = 0;
        for (const db of guilds) {
            i++;
            setTimeout(async () => {
                if (!db.dailyMsg) return;
                if (!isNaN(db.dailyDay)) {
                    if (db.dailyDay === new Date().getDay()) return;
                }

                if (mom.tz(db.dailyTimezone).format("HH:mm") === "12:00") {
                    await this.c.database.updateGuild(db.guildID, {
                        dailyDay: today.getDay()
                    }, false)

                    const channel = await this.c.channels.fetch(db.dailyChannel).catch(err => {
                    });

                    channel.data = db;

                    if (!channel?.id) return; // Always directly return before do to many actions

                    const {Useless_Powers, Useful_Powers} = await require(`../data/power-${db.language}.json`);
                    const {WouldYou, Rather} = await require(`../languages/${db.language}.json`);

                    if (db.dailyRather) {
                        let power;
                        let power2;
                        if (db.customTypes === "regular") {
                            let array = [];
                            array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
                            array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
                            power = array[Math.floor(Math.random() * array.length)];
                            power2 = array[Math.floor(Math.random() * array.length)];
                            array = [];
                        } else if (db.customTypes === "mixed") {
                            let array = [];
                            if (db.customMessages.filter(c => c.type !== "nsfw") != 0) {
                                array.push(db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg);
                            } else {
                                power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                            }
                            array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
                            array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
                            power = array[Math.floor(Math.random() * array.length)];
                            power2 = array[Math.floor(Math.random() * array.length)];
                            array = [];
                        } else if (db.customTypes === "custom") {
                            if (db.customMessages.filter(c => c.type !== "nsfw") === 0) {
                                return this.c.webhookHandler.sendWebhook(
                                    channel,
                                    db.dailyChannel,
                                    {
                                        content: 'There\'s currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.'
                                    }
                                )
                            }

                            power = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                            power2 = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                        }

                        const embed = new EmbedBuilder()
                            .setColor('#0598F6')
                            .setFooter({
                                text: `${Rather.embed.footer}`,
                                iconURL: this.c.user.avatarURL(),
                            })
                            .setTimestamp()
                            .addFields(
                                {
                                    name: Rather.embed.usefulname,
                                    value: `> 1️⃣ ${power}`,
                                    inline: false,
                                },
                                {
                                    name: Rather.embed.usefulname2,
                                    value: `> 2️⃣ ${power2}`,
                                    inline: false,
                                },
                            )

                        return this.c.webhookHandler.sendWebhook(
                            channel,
                            db.dailyChannel,
                            {
                                embeds: [embed],
                                content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                            }
                        );
                    }

                    let power;
                    if (db.customTypes === "regular") {
                        let array = [];
                        array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
                        array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
                        power = array[Math.floor(Math.random() * array.length)]
                        array = [];
                    } else if (db.customTypes === "mixed") {
                        let array = [];
                        if (db.customMessages.filter(c => c.type !== "nsfw") !== 0) {
                            array.push(db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg);
                        } else {
                            power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
                        }
                        array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
                        array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
                        power = array[Math.floor(Math.random() * array.length)]
                        array = [];
                    } else if (db.customTypes === "custom") {
                        if (db.customMessages.filter(c => c.type !== "nsfw") === 0) {
                            this.c.webhookHandler.sendWebhook(
                                channel,
                                db.dailyChannel,
                                {
                                    content: 'There\'s currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.'
                                }
                            )
                        }

                        power = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                    }

                    const embed = new EmbedBuilder()
                        .setColor('#0598F6')
                        .setFooter({
                            text: `${WouldYou.embed.footer}`,
                            iconURL: this.c.user.avatarURL(),
                        })
                        .setTimestamp()
                        .addFields({
                            name: WouldYou.embed.Usefulname,
                            value: `> ${power}`,
                            inline: false,
                        });

                    return this.c.webhookHandler.sendWebhook(
                        channel,
                        db.dailyChannel,
                        {
                            embeds: [embed],
                            content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                        }
                    );
                }
            }, i * 2500) // We do a little timeout here to work against discord ratelimit with 50reqs/second
        }
    }
};
