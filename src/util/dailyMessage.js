const {EmbedBuilder} = require('discord.js');
const mom = require("moment-timezone");
const {ChalkAdvanced} = require("chalk-advanced");
const CronJob = require('cron').CronJob;

module.exports = class DailyMessage {
    constructor(c) {
       this.c = c;
    }

    /**
     * Start the daily message Schedule
     */
    start() {
        var job = new CronJob('0 */60 * * * *', async () => {
            await this.runSchedule();
        });
        job.start()
    }

    /**
     * Run the daily message schedule
     * @return {Promise<void>}
     */
    async runSchedule() {
        let test = 0;
        let guilds = await this.c.database.getAll();
        guilds = guilds.filter(g => this.c.guilds.cache.has(g.guildID) && g.dailyMsg);

        console.log(
            `${ChalkAdvanced.white('Daily Message')} ${ChalkAdvanced.gray(
                '>',
            )} ${ChalkAdvanced.green('Running daily message check for ' + guilds.length + ' guilds')}`,
        );

        let i = 0;
        for (const db of guilds) {
            if(!db?.dailyChannel) return;
            i++;
            setTimeout(async () => {
                if (!db.dailyMsg) return;
                if (mom.tz(db.dailyTimezone).format("HH:mm") === "12:00") {
                    const channel = await this.c.channels.fetch(db.dailyChannel).catch(err => { console.log(err)
                    });

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
                                test++
                                this.c.webhookHandler.sendWebhook(
                                    channel,
                                    db.dailyChannel,
                                    {
                                        content: 'There\'s currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.'
                                    }
                                ).catch(err => { console.log(err)
                                });
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
                                    value: `> 1ï¸âƒ£ ${power}`,
                                    inline: false,
                                },
                                {
                                    name: Rather.embed.usefulname2,
                                    value: `> 2ï¸âƒ£ ${power2}`,
                                    inline: false,
                                },
                            )
                            test++
                        this.c.webhookHandler.sendWebhook(
                            channel,
                            db.dailyChannel,
                            {
                                embeds: [embed],
                                content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                            }
                        ).catch(err => { console.log(err)
                        });
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
                        if (db.customMessages.filter(c => c.type !== "nsfw") != 0) {
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
                            test++
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
                        test++
                    this.c.webhookHandler.sendWebhook(
                        channel,
                        db.dailyChannel,
                        {
                            embeds: [embed],
                            content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                        }
                    ).catch(err => { console.log(err)
                    });
                }
            }, i * 2500) // We do a little timeout here to work against discord ratelimit with 50reqs/second
        }
        console.log(test)
    }
};
