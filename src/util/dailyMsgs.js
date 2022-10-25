const { EmbedBuilder } = require('discord.js');
const guildLang = require('./Models/guildModel');
const mom = require("moment-timezone");
module.exports = async (client) => {
    setInterval(async function () {
        const guilds = await guildLang.find();
        guilds.map(async db => {
            if (!db.dailyMsg) return;
            if (!isNaN(db.dailyDay)) { if (db.dailyDay === new Date().getDay()) return; }
            if (mom.tz(db.dailyTimezone).format("HH:mm") === "12:00") {
                db.dailyDay = new Date().getDay();
                db.save();

                const { Useless_Powers, Useful_Powers, } = await require(`../data/power-${db.language}.json`);
                const { WouldYou } = await require(`../languages/${db.language}.json`);
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
                    if (db.customMessages.filter(c => c.type !== "nsfw") == 0) return client.channels.cache
                        .get(db.dailyChannel)
                        .send({ ephemeral: true, content: "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages." }).catch((err) => { });
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

                if (db.dailyRole) {
                    try {
                        client.channels.fetch(db.dailyChannel)
                        client.channels.cache?.get(db.dailyChannel)?.send({ embeds: [embed], content: `<@&${db.dailyRole}>` }).catch((err) => { });
                    } catch {
                        return;
                    }
                } else {
                    try {
                        client.channels.fetch(db.dailyChannel)
                        client.channels.cache?.get(db.dailyChannel)?.send({ embeds: [embed] }).catch((err) => { });
                    } catch {
                        return;
                    }
                }
            }
        })
    }, 4000)
};
