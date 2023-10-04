import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { white, gray, green } from "chalk-advanced";
import QuickChart from "quickchart-js";
import { v4 as uuidv4 } from "uuid";
import Sentry from "@sentry/node";
import WouldYou from "./wouldYou";
import { VoteModel } from "./Models/voteModel";

const chart = new QuickChart();
chart.setWidth(750);
chart.setHeight(750);
chart.setBackgroundColor("#2F3136");
chart.setVersion("2");

export default class Voting {
  private client: WouldYou;
  private _cache: Map<string, any>;

  constructor(client: WouldYou) {
    this.client = client;
    this._cache = new Map();
  }

  async saveVoting({ guildId, type, until, channelId, op_one, op_two }: {guildId: string, type: any, until: any, channelId: string, op_one: any, op_two: any}) {
    const id = uuidv4();

    const vote = new VoteModel({
      id,
      guild: guildId,
      channel: channelId,
      type,
      until: until,
      votes: {
        op_one,
        op_two,
      },
    });
    await vote.save();

    this._cache.set(id, vote);

    return id;
  }

  async generateVoting(
    guildId: any = null,
    channelId: any = null,
    until = 0,
    type: any,
    op_one?: any,
    op_tow?: any,
  ) {
    let g;
    if (guildId !== null && typeof guildId === "string")
      g = this.client.database.getGuild(String(guildId));

    const voteId = await this.saveVoting({
      guildId,
      channelId,
      until,
      type,
      op_one: op_one ? op_one : [],
      op_two: op_tow ? op_tow : [],
    });

    const row = new ActionRowBuilder();
    switch (type) {
      case "wouldyourather":
        row.addComponents([
          new ButtonBuilder()
            .setCustomId(`result_${voteId}`)
            .setLabel("Results")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_${type}_0`)
            .setEmoji("1️⃣")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_${type}_1`)
            .setEmoji("2️⃣")
            .setStyle(ButtonStyle.Primary),
        ]);
        break;
      case "neverhaveiever":
        row.addComponents([
          new ButtonBuilder()
            .setCustomId(`result_${voteId}`)
            .setLabel("Results")
            .setDisabled(false)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_${type}_0`)
            .setLabel("✅")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_${type}_1`)
            .setLabel("❌")
            .setStyle(ButtonStyle.Primary),
        ]);
        break;
    }

    return {
      row,
      id: voteId,
    };
  }

  async getVoting(id: string) {
    if (!this._cache.get(id))
      return await VoteModel.findOne({
        id: id,
      });

    return this._cache.get(id);
  }

  async deleteVoting(id: string) {
    await VoteModel.deleteOne({
      id: id,
    });

    this._cache.delete(id);
  }

  async addVote(id: string, userId: string, option: any = 1) {
    const vote = await this.getVoting(id);
    if (!vote) return false;

    const options = ["op_one", "op_two"];

    for (const option of options) {
      vote.votes[option] = vote.votes[option].filter((v: any) => v !== userId);
    }

    vote.votes[options[option]].push(userId);

    this._cache.set(id, vote);
    await vote.save();

    return true;
  }

  async getVotingResults(id: string) {
    const vote = await this.getVoting(id);
    if (!vote) return false;

    let g;
    if (vote.guildId !== null && typeof vote.guildId === "string")
      g = this.client.database.getGuild(String(vote.guildId));

    const all_votes = Number(
      vote.votes.op_one?.length + vote.votes.op_two?.length,
    );
    const option_1 = Number(vote.votes.op_one?.length);
    const option_2 = Number(vote.votes.op_two?.length);

    const numbers = { op_one: 1, op_two: 2 } as any;
    const phrases = { op_one: "Yes", op_two: "No" } as any;
    const chartData = Object.keys(vote.votes).map((e) =>
      Number(all_votes > 0 ? vote.votes[e].length : 1),
    );
    const chartLabels = Object.keys(vote.votes).map((e) =>
      vote.type == 0 ? "Question #" + numbers[e] : phrases[e],
    );

    chart.setConfig({
      type: "outlabeledPie",
      data: {
        labels: chartLabels.reverse(),
        datasets: [
          {
            backgroundColor: ["#0091ff", "#f00404"],
            data: chartData.reverse(),
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          outlabels: {
            text: "%l %p",
            color: "white",
            stretch: 35,
            font: {
              resizable: true,
              minSize: 12,
              maxSize: 18,
            },
          },
        },
      },
    });

    return {
      all_votes,
      option_1,
      option_2,
      chart: chart.getUrl(),
    };
  }

  /**
   * Start the daily message Schedule
   */
  start() {
    const olderthen = (date: Date, daysBetween: number) => {
      const then = new Date();
      then.setDate(then.getDate() - daysBetween);

      const msBetweenDates = date.getTime() - then.getTime();

      return !(Math.round(msBetweenDates / 1000 / 60 / 60 / 24) >= daysBetween);
    };

    setTimeout(async () => {
      const votes = await VoteModel.find();
      for (const vote of votes) {
        if (olderthen(new Date((vote as any).createdAt), 30))
          return VoteModel.deleteOne({ id: vote.id }).catch((err) => {
            Sentry.captureException(err);
            return;
          });
        this._cache.set(vote.id, vote);
      }

      console.log(
        `${white("Would You?")} ${gray(
          ">",
        )} ${green("Successfully loaded votes from database")}`,
      );
    }, 500);
  }
};
