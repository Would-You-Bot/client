require("dotenv").config();
const Topgg = require("@top-gg/sdk");
const Sentry = require("@sentry/node");
const {
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  hideLinkEmbed,
} = require("discord.js");
const express = require("express");
const axios = require("axios");
const { ChalkAdvanced } = require("chalk-advanced");
const app = express();
const webhook = new Topgg.Webhook(process.env.TOPGG_WEBHOOK);

module.exports = class VoteLogger {
  constructor(c) {
    this.c = c;
    this.api = new Topgg.Api(process.env.TOPGG_TOKEN);
    this.votes = new Map();

    this.getVotes().then(() => {
      console.log(
        `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
          ">",
        )} ${ChalkAdvanced.green("Successfully updated votes")}`,
      );
    });

    setInterval(
      () => {
        this.getVotes().then(() => {
          console.log(
            `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
              ">",
            )} ${ChalkAdvanced.green("Successfully updated votes")}`,
          );
        });
      },
      15 * 60 * 1000,
    );
  }

  /**
   * Get all votes from top.gg
   * @return {Promise<void>}
   */
  async getVotes() {
    const votes = await this.api.getVotes();

    this.votes = new Map();

    for (const vote of votes) {
      this.votes.set(vote.id, vote);
    }
  }

  /**
   * Start the api for the vote tracker
   * @return {void}
   */
  startAPI() {
    app.post(
      "/dblwebhook",
      webhook.listener(async (vote) => {
        let userdata = null;
        await axios({
          method: "GET",
          url: `https://japi.rest/discord/v1/user/${vote.user}`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            userdata = res?.data?.data;
          })
          .catch((err) => {
            Sentry.captureException(err);
            userdata = this.c?.users?.cache?.get(vote.user) ?? null;
          });

        if (!userdata?.username) return;

        let emojis = [
          "<a:jammiesyou:1009965703484424282>",
          "<a:nyancatyou:1009965705808056350>",
          "<a:partyparrotyou:1009965704621080678>",
          "<a:shootyou:1009965706978267136>",
          "<a:catjamyou:1009965950101110806>",
          "<a:patyou:1009964589678612581>",
          "<a:patyoufast:1009964759216574586>",
        ];

        const button = new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("Vote!")
            .setStyle(5)
            .setEmoji("💻")
            .setURL("https://top.gg/bot/981649513427111957/vote"),
        ]);

        const emojisRandom = emojis[Math.floor(Math.random() * emojis.length)];

        const webhookClient = new WebhookClient({
          url: process.env.LOG_VOTE,
        });

        console.log(
          `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
            ">",
          )} ${ChalkAdvanced.green(`${userdata.tag} voted for me!`)}`,
        );

        webhookClient
          .send({
            content: `${emojisRandom} Voted for me on ${hideLinkEmbed(
              "https://top.gg/bot/981649513427111957/vote",
            )}`,
            components: [button],
            username: `${userdata.tag
              .replace("Discord", "")
              .replace("discord", "")
              .replace("Everyone", "")
              .replace("everyone", "")}`,
            avatarURL: userdata.avatarURL,
          })
          .catch((err) => Sentry.captureException(err));
      }),
    );

    app.listen(5643);
  }
};
