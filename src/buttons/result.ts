import { EmbedBuilder } from "discord.js";
import { Button } from "../models";
import Paginator from "../util/pagination";

const button: Button = {
  name: "result",
  execute: async (interaction, client, guildDb) => {
    const customId = interaction.customId.split("_");

    const votingResults = await client.voting.getVotingResults(customId[1]);
    if (!votingResults) {
      await interaction.reply({
        content: "Unable to fetch results.",
        ephemeral: true,
      });
      return;
    }

    let paginate = client.paginate.get(
      `${interaction.user.id}-${interaction.message.reference?.messageId}`,
    );
    if (paginate) {
      clearTimeout(paginate.timeout);
      client.paginate.delete(
        `${interaction.user.id}-${interaction.message.reference?.messageId}`,
      );
    }

    const page = new Paginator({
      user: interaction.user.id,
      timeout: 180000,
      client,
    });

    page.add(
      new EmbedBuilder()
        .setImage(votingResults.chart)
        .setColor(
          votingResults.option_1 < votingResults.option_2
            ? "#0091ff"
            : "#f00404",
        ),
      null,
    );

    let data: any;
    data = await Promise.all(
      votingResults.votes.op_one.map(async (u: any) => {
        const user = await client.database.getUser(u, true);
        return user?.votePrivacy ? "Anonymous" : u;
      }),
    );
    data = data.map(
      (s: string, i = 1) =>
        `${i++}. ${s === "Anonymous" ? s : `<@${s}> (${s})`}`,
    );
    data = Array.from(
      {
        length: Math.ceil(data.length / 10),
      },
      (a, r) => data.slice(r * 10, r * 10 + 10),
    );

    Math.ceil(data.length / 10);
    data = data.map((e: any) =>
      page.add(
        new EmbedBuilder()
          .setTitle(`Voted for Option 1`)
          .setDescription(e.slice(0, 10).join("\n").toString())
          .setColor("#0598F6"),
        null,
      ),
    );

    let data2: any;
    data2 = await Promise.all(
      votingResults.votes.op_two.map(async (u: any) => {
        const user = await client.database.getUser(u, true);
        return user?.votePrivacy ? "Anonymous" : u;
      }),
    );
    data2 = data2.map(
      (s: string, i = 1) =>
        `${i++}. ${s === "Anonymous" ? s : `<@${s}> (${s})`}`,
    );
    data2 = Array.from(
      {
        length: Math.ceil(data2.length / 10),
      },
      (a, r) => data2.slice(r * 10, r * 10 + 10),
    );

    Math.ceil(data2.length / 10);
    data2 = data2.map((e: any) =>
      page.add(
        new EmbedBuilder()
          .setTitle(`Voted for Option 2`)
          .setDescription(e.slice(0, 10).join("\n").toString())
          .setColor("#F00605"),
        null,
      ),
    );

    return await page.start(interaction, null);
  },
};

export default button;
