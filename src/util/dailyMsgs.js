const {EmbedBuilder} = require('discord.js');
const guildLang = require('./Models/guildModel');
const mom = require("moment-timezone");
module.exports = async (client) => {
    setInterval(async function () {
        const today = new Date();

        let guilds = await client.database.getAll();
        guilds = guilds.filter(g => client.guilds.cache.has(g.guildID) && g.dailyMsg && Number(g.dailyDay) !== today.getDay());

        let i = 0;
        for (const db of guilds) {
            i++;
            setTimeout(async () => {
                if (!db.dailyMsg) return;
                if (!isNaN(db.dailyDay)) {
                    if (db.dailyDay === new Date().getDay()) return;
                }
                if (mom.tz(db.dailyTimezone).format("HH:mm") === "09:52") {
                    await client.database.updateGuild(db.guildID, {
                        dailyDay: today.getDay()
                    }, false)

                    const channel = await client.channels.fetch(db.dailyChannel).catch(err => {
                    });

                    if (!channel?.id) return; // Always directly return before do to many actions

                    const {Useless_Powers, Useful_Powers,} = await require(`../data/power-${db.language}.json`);
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
                            client.channels.fetch(db.dailyChannel).catch((err) => {
                                return;
                            });
                            ;
                            if (db.customMessages.filter(c => c.type !== "nsfw") == 0) return client.channels.cache
                                .get(db.dailyChannel)
                                .send({
                                    ephemeral: true,
                                    content: "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages."
                                }).catch(() => {
                                })
                            power = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                            power2 = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                        }

                        const embed = new EmbedBuilder()
                            .setColor('#0598F6')
                            .setFooter({
                                text: `${Rather.embed.footer}`,
                                iconURL: client.user.avatarURL(),
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

                        return channel.send({
                            embeds: [embed],
                            content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                        }).catch((err) => {
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
                        client.channels.fetch(db.dailyChannel).catch((err) => {
                            return;
                        });
                        if (db.customMessages.filter(c => c.type !== "nsfw") == 0) return client.channels.cache
                            .get(db.dailyChannel)
                            .send({
                                ephemeral: true,
                                content: "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages."
                            }).catch(() => {
                                return;
                            })
                        power = db.customMessages.filter(c => c.type !== "nsfw")[Math.floor(Math.random() * db.customMessages.filter(c => c.type !== "nsfw").length)].msg;
                    }

                    const embed = new EmbedBuilder()
                        .setColor('#0598F6')
                        .setFooter({
                            text: `${WouldYou.embed.footer}`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
                        .addFields({
                            name: WouldYou.embed.Usefulname,
                            value: `> ${power}`,
                            inline: false,
                        });

                    return channel.send({
                        embeds: [embed],
                        content: db.dailyRole ? `<@&${db.dailyRole}>` : null
                    }).catch((err) => {
                    });
                }
            }, i * 2500) // We do a little timeout here to work against discord ratelimit with 50reqs/second
        }
    }, 60 * 1000) // Because of your configuration it is okay to just do that every minute
};
