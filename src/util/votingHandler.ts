import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import QuickChart from "quickchart-js";
import { v4 as uuidv4 } from "uuid";
import { VoteModel } from "./Models/voteModel";
import type WouldYou from "./wouldYou";

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

  async saveVoting({
    guildId,
    type,
    until,
    channelId,
    op_one,
    op_two,
  }: {
    guildId: string | null;
    type: string;
    until: Date;
    channelId: string;
    op_one: string[];
    op_two: string[];
  }) {
    const id = uuidv4();

    const vote = await VoteModel.findOneAndUpdate(
      { id: id },
      {
        $set: {
          guild: guildId,
          channel: channelId,
          type: type,
          until: until,
        },
        $setOnInsert: {
          votes: {
            op_one: op_one,
            op_two: op_two,
          },
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    this._cache.set(id, vote);

    return id;
  }

  async generateVoting(
    guildId: string | null,
    channelId: string,
    until: Date,
    type: string,
    op_one?: string[],
    op_tow?: string[],
  ) {
    if (guildId !== null && typeof guildId === "string")
      this.client.database.getGuild(String(guildId));

    const voteId = await this.saveVoting({
      guildId,
      channelId,
      until,
      type,
      op_one: op_one ? op_one : [],
      op_two: op_tow ? op_tow : [],
    });

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
    switch (type) {
      case "wouldyourather":
        row.addComponents([
          new ButtonBuilder()
            .setCustomId(`result_${voteId}`)
            .setLabel("Results")
            .setDisabled(true)
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

  async getRawVotingResults(id: string) {
    const vote = await this.getVoting(id);
    if (!vote) return false;
    if (vote.guildId !== null && typeof vote.guildId === "string")
      this.client.database.getGuild(String(vote.guildId));

    const all_votes = Number(
      vote.votes.op_one?.length + vote.votes.op_two?.length,
    );
    const option_1 = Number(vote.votes.op_one?.length);
    const option_2 = Number(vote.votes.op_two?.length);

    return {
      votes: vote.votes,
      all_votes,
      option_1,
      option_2,
    };
  }

  async getVotingResults(id: string) {
    const vote = await this.getVoting(id);
    if (!vote) return false;

    if (vote.guildId !== null && typeof vote.guildId === "string")
      this.client.database.getGuild(String(vote.guildId));

    const all_votes = Number(
      vote.votes.op_one?.length + vote.votes.op_two?.length,
    );
    const option_1 = Number(vote.votes.op_one?.length);
    const option_2 = Number(vote.votes.op_two?.length);

    const numbers = { op_one: "Have", op_two: "Have not" } as any;
    const phrases = {
      op_one: "Option 1",
      op_two: "Option 2",
    } as any;
    const chartData = Object.keys(vote.votes).map((e) =>
      Number(all_votes > 0 ? vote.votes[e].length : 1),
    );

    const chartLabels = Object.keys(vote.votes).map((e) =>
      vote.type === "neverhaveiever" ? numbers[e] : phrases[e],
    );

    chart.setConfig({
      type: "outlabeledPie",
      data: {
        labels: chartLabels,
        datasets: [
          {
            backgroundColor: ["#0091ff", "#f00404"],
            data: chartData,
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
      votes: vote.votes,
      all_votes,
      option_1,
      option_2,
      chart: chart.getUrl(),
    };
  }
}
