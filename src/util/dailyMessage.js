const { EmbedBuilder } = require("discord.js");
const mom = require("moment-timezone");
const { ChalkAdvanced } = require("chalk-advanced");
const CronJob = require("cron").CronJob;

module.exports = class DailyMessage {
  constructor(client) {
    this.client = client;
  }

  /**
   * Start the daily message Schedule
   */
  start() {
    new CronJob(
      "0 */30 * * * *",
      async () => {
        await this.runSchedule();
      },
      null,
      true,
      "Europe/Berlin",
    );
  }

  /**
   * Run the daily message schedule
   * @return {Promise<void>}
   */
  async runSchedule() {
    let guilds = await this.client.database.getAll();
    //guilds = guilds.filter(g => this.client.guilds.cache.has(g.guildID) && g.dailyMsg);
    guilds = guilds.filter(
      (g) => mom.tz(g.dailyTimezone).format("HH:mm") === g.dailyInterval,
    );

    console.log(
      `${ChalkAdvanced.white("Daily Message")} ${ChalkAdvanced.gray(
        ">",
      )} ${ChalkAdvanced.green(
        "Running daily message check for " + guilds.length + " guilds",
      )}`,
    );

    let i = 0;
    for (const db of guilds) {
      if (!db?.dailyChannel) continue;
      if (!db.dailyMsg) continue;
      i++;
      setTimeout(async () => {
        const channel = await this.client.channels
          .fetch(db.dailyChannel)
          .catch((err) => {
            console.log(err);
          });

        if (!channel?.id) return; // Always directly return before do to many actions

        const { General } = await require(`../data/rather-${db.language}.json`);
        const { WhatYouDo } = await require(`../data/wwyd-${db.language}.json`);

        let randomDaily = [];
        let dailyId;
        if (db.customTypes === "regular") {
          let array = [];
          array.push(...General, ...WhatYouDo);
          randomDaily = array[Math.floor(Math.random() * array.length)];
        } else if (db.customTypes === "mixed") {
          let array = [];
          if (db.customMessages.filter((c) => c.type !== "nsfw").length != 0) {
            array.push(
              db.customMessages.filter((c) => c.type !== "nsfw")[
                Math.floor(
                  Math.random() *
                    db.customMessages.filter((c) => c.type !== "nsfw").length,
                )
              ].msg,
            );
          } else {
            randomDaily = [...General, ...WhatYouDo];
          }
          array.push(...General, ...WhatYouDo);
          randomDaily = array[Math.floor(Math.random() * array.length)];
        } else if (db.customTypes === "custom") {
          if (db.customMessages.filter((c) => c.type !== "nsfw").length === 0) {
            return this.client.webhookHandler
              .sendWebhook(
                channel,
                db.dailyChannel,
                {
                  content:
                    "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.",
                },
                db.dailyThread,
              )
              .catch((err) => {
                console.log(err);
              });
          }

          randomDaily = db.customMessages.filter((c) => c.type !== "nsfw")[
            Math.floor(
              Math.random() *
                db.customMessages.filter((c) => c.type !== "nsfw").length,
            )
          ].msg;
        }

        dailyId = Math.floor(Math.random() * randomDaily.length);

        const embed = new EmbedBuilder()
          .setColor("#0598F6")
          .setFooter({
            text: `Daily Message | Type: ${db.customTypes.replace(/^\w/, (c) =>
              c.toUpperCase(),
            )} | ID: ${dailyId}`,
          })
          .setDescription(randomDaily);
        await this.client.webhookHandler
          .sendWebhook(
            channel,
            db.dailyChannel,
            {
              embeds: [embed],
              content: db.dailyRole ? `<@&${db.dailyRole}>` : null,
            },
            db.dailyThread,
          )
          .catch((err) => {
            console.log(err);
          });
      }, i * 2500); // We do a little timeout here to work against discord ratelimit with 50reqs/second
    }
  }
};
