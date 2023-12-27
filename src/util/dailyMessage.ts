import { EmbedBuilder, bold } from "discord.js";
import * as mom from "moment-timezone";
import { white, gray, green } from "chalk-advanced";
import { CronJob } from "cron";
import { captureException } from "@sentry/node";
import WouldYou from "./wouldYou";
import { getWouldYouRather, getWwyd } from "./Functions/jsonImport";

export default class DailyMessage {
  private client: WouldYou;

  constructor(client: WouldYou) {
    this.client = client;
  }

  /**
   * Start the daily message Schedule
   */
  start() {
    new CronJob(
      "0 */30 * * * *", // Every 30 minutes, every hour, every day
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
    mom.tz.add(
      "America/Los_Angeles|PST PDT|80 70|01010101010101010101010|1BQW0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6",
    );
    let guilds = await this.client.database.getAll();
    //guilds = guilds.filter(g => this.client.guilds.cache.has(g.guildID) && g.dailyMsg);
    guilds = guilds.filter(
      (g) => mom.tz(g.dailyTimezone).format("HH:mm") === g.dailyInterval,
    );

    console.log(
      `${white("Daily Message")} ${gray(">")} ${green(
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
          .catch(async (err) => {
            await this.client.database.updateGuild(db?.guildID || "", {
              db,
              dailyMsg: false,
            });
          });

        if (!channel?.id) {
          await this.client.database.updateGuild(db?.guildID || "", {
            db,
            dailyMsg: false,
          });
          return;
        } // Always directly return before do to many actions

        const General = await getWouldYouRather(db.language);
        const WhatYouDo = await getWwyd(db.language);

        let randomDaily: any;
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
              .catch(async (err) => {
                await this.client.database.updateGuild(db?.guildID || "", {
                  db,
                  dailyMsg: false,
                });
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
          .setDescription(bold(randomDaily) as string);
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
          .catch(async (err) => {
            await this.client.database.updateGuild(db?.guildID || "", {
              db,
              dailyMsg: false,
            });
          });

        await this.client.database.updateGuild(db?.guildID, {
          lastUsageTimestamp: Date.now(),
        });
      }, i * 2500); // We do a little timeout here to work against discord ratelimit with 50reqs/second
    }
  }
}
