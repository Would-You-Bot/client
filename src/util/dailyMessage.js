const { EmbedBuilder } = require('discord.js');
const mom = require("moment-timezone");
const { ChalkAdvanced } = require("chalk-advanced");
const CronJob = require('cron').CronJob;

module.exports = class DailyMessage {
    constructor(c) {
        this.c = c;
    }

    /**
     * Start the daily message Schedule
     */
    start() {
        new CronJob('0 */30 * * * *', async () => {
            await this.runSchedule();
        }, null, true, "Europe/Berlin");
    }

    /**
     * Run the daily message schedule
     * @return {Promise<void>}
     */
    async runSchedule() {
        let guilds = await this.c.database.getAll();
        guilds = guilds.filter(g => this.c.guilds.cache.has(g.guildID) && g.dailyMsg);
        guilds = guilds.filter(g => mom.tz(g.dailyTimezone).format("HH:mm") === g.dailyInterval);

        console.log(
            `${ChalkAdvanced.white('Daily Message')} ${ChalkAdvanced.gray(
                '>',
            )} ${ChalkAdvanced.green('Running daily message check for ' + guilds.length + ' guilds')}`,
        );

        let i = 0;
        for (const db of guilds) {
            if (!db?.dailyChannel) continue;
            if (!db.dailyMsg) continue;
            i++;
            setTimeout(async () => {
                const channel = await this.c.channels.fetch(db.dailyChannel).catch(err => {
                    console.log(err)
                });

                if (!channel?.id) return; // Always directly return before do to many actions

                const { Useless_Powers, Useful_Powers } = await require(`../data/power-${db.language}.json`);
                const { WouldYou, Rather } = await require(`../languages/${db.language}.json`);

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
                        this.c.webhookHandler.sendWebhook(
                            channel,
                            db.dailyChannel,
                            {
                                content: 'There\'s currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.'
                            }
                        ).catch(err => {
                            console.log(err)
                        });
                    }

                    power = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                }

                const embed = new EmbedBuilder()
                    .setColor("#0598F6")
                    .setFooter({
                        text: `Daily Message | Type: Random | ID: ${randomDaily}`,
                        iconURL: interaction.user.avatarURL()
                    })
                    .setDescription(neverArray[randomNever]);
                this.c.webhookHandler.sendWebhook(
                    channel,
                    db.dailyChannel,
                    {
                        embeds: [embed],
                        content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                    }
                ).catch(err => {
                    console.log(err)
                });
            }, i * 2500) // We do a little timeout here to work against discord ratelimit with 50reqs/second
        }
    }
};
