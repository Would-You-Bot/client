import colors from 'colors';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import QuickChart from 'quickchart-js';

import { v4 as uuidv4 } from 'uuid';

import voteModel from '@models/vote.model';
import { ExtendedClient } from 'src/client';

const chart = new QuickChart();
chart.setWidth(750);
chart.setHeight(750);
chart.setBackgroundColor('#2F3136');
chart.setVersion('2');

interface SaveVotingProps {
  guildId: string;
  type: number;
  until: number;
  channelId: string;
  opOne: string[];
  opTwo: string[];
}

export default class Voting {
  client: ExtendedClient;
  cache: Map<string, any>;

  constructor(client: ExtendedClient) {
    this.client = client;
    this.cache = new Map();
  }

  async saveVoting({
    guildId,
    type = 0,
    until,
    channelId,
    opOne,
    opTwo,
  }: SaveVotingProps) {
    const id = uuidv4();

    const vote = await voteModel.create({
      id,
      guild: guildId,
      channel: channelId,
      type,
      until,
      votes: {
        opOne,
        opTwo,
      },
    });

    this.cache.set(id, vote);

    return id;
  }

  async generateVoting(
    guildId: string | null = null,
    channelId: string | null = null,
    until: number = 0,
    type: number = 0,
    opOne?: string[],
    opTwo?: string[]
  ) {
    if (!guildId || !channelId) return;

    let g;
    if (guildId) g = this.client.database.getGuild(String(guildId));

    const voteId = await this.saveVoting({
      guildId,
      channelId,
      until,
      type,
      opOne: opOne ? opOne : [],
      opTwo: opTwo ? opTwo : [],
    });

    const row = new ActionRowBuilder<ButtonBuilder>();
    switch (type) {
      case 0:
        row.addComponents([
          new ButtonBuilder()
            .setCustomId(`result_${voteId}`)
            .setLabel('Results')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_0`)
            .setEmoji('1️⃣')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_1`)
            .setEmoji('2️⃣')
            .setStyle(ButtonStyle.Primary),
        ]);
        break;
      case 1:
        row.addComponents([
          new ButtonBuilder()
            .setCustomId(`result_${voteId}`)
            .setLabel('Results')
            .setDisabled(false)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_0`)
            .setLabel('✅')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`voting_${voteId}_1`)
            .setLabel('❌')
            .setStyle(ButtonStyle.Primary),
        ]);
        break;
    }

    return {
      row,
      id: voteId,
    };
  }

  getVoting(id: string) {
    return this.cache.get(id);
  }

  async deleteVoting(id: string) {
    await voteModel.deleteOne({
      id: id,
    });

    this.cache.delete(id);
  }

  async addVote(id: string, userId: string, option: number = 1) {
    const vote = this.getVoting(id);
    if (!vote) return false;

    const options = ['opOne', 'opTwo'];

    options.forEach((option) => {
      vote.votes[option] = vote.votes[option].filter(
        (v: string) => v !== userId
      );
    });

    vote.votes[options[option]].push(userId);

    this.cache.set(id, vote);
    await vote.save();

    return true;
  }

  async getVotingResults(id: string) {
    const vote = this.getVoting(id);
    if (!vote) return false;

    let g;
    if (vote.guildId !== null && typeof vote.guildId === 'string')
      g = this.client.database.getGuild(String(vote.guildId));

    const all_votes = Number(
      vote.votes.opOne?.length + vote.votes.opTwo?.length
    );
    const option_1 = Number(vote.votes.opOne?.length);
    const option_2 = Number(vote.votes.opTwo?.length);

    const numbers: { [key: string]: number } = { opOne: 1, opTwo: 2 };
    const phrases: { [key: string]: string } = { opOne: 'Yes', opTwo: 'No' };
    const chartData = Object.keys(vote.votes).map((e) =>
      Number(all_votes > 0 ? vote.votes[e].length : 1)
    );
    const chartLabels = Object.keys(vote.votes).map((e) =>
      vote.type == 0 ? 'Question #' + numbers[e] : phrases[e]
    );

    chart.setConfig({
      type: 'outlabeledPie',
      data: {
        labels: chartLabels.reverse(),
        datasets: [
          {
            backgroundColor: ['#0091ff', '#f00404'],
            data: chartData.reverse(),
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          outlabels: {
            text: '%l %p',
            color: 'white',
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
      const votes = await voteModel.find();
      if (!votes) return;
      votes.forEach((vote) => {
        if (olderthen(new Date(`${vote.createdAt}`), 30))
          return voteModel
            .deleteOne({ id: vote.id })
            .catch(this.client.logger.error);
        this.cache.set(vote.id, vote);
      });

      this.client.logger.info(
        `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
          'Successfully loaded votes from database'
        )}`
      );
    }, 500);
  }
}
