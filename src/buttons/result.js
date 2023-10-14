const { EmbedBuilder } = require("discord.js");
const Paginator = require("../util/pagination");

module.exports = {
  data: {
    name: "result",
    description: "The voting result",
  },
  async execute(interaction, client, guildDb) {
    const customId = interaction.customId.split("_");

    const votingResults = await client.voting.getVotingResults(customId[1]);
    if (!votingResults)
      return await interaction.reply({
        content: "Unable to fetch results.",
        ephemeral: true,
      });

    let paginate = client.paginate.get(interaction.user.id)
    if (paginate) {
      clearTimeout(paginate.timeout);
      client.paginate.delete(interaction.user.id);
    }

    const page = new Paginator({
      user: interaction.user.id,
      timeout: 180000,
      client,
    });

    page.add(
      new EmbedBuilder()
        .setImage(votingResults.chart)
        .setColor(votingResults.option_1 < votingResults.option_2 ? "#0091ff" : "#f00404"),
    );

    let data;
    data = await Promise.all(
      votingResults.votes.op_one.map(async (u) => {
        const user = await client.database.getUser(u, true);
        return user.votePrivacy ? null : u;
      })
    ).then((filteredIds) => filteredIds.filter((id) => id !== null));
    data = data
      .map((s, i = 1) => `${i++}. <@${s}> (${s})`);
    data = Array.from(
      {
        length: Math.ceil(data.length / 10),
      },
      (a, r) => data.slice(r * 10, r * 10 + 10),
    );

    Math.ceil(data.length / 10);
    data = data.map((e) =>
      page.add(
        new EmbedBuilder()
          .setTitle(`Voted "Yes"`)
          .setDescription(e.slice(0, 10).join("\n").toString())
          .setColor("#F00605"),
      ),
    );

    let data2;
    data2 = await Promise.all(
      votingResults.votes.op_two.map(async (u) => {
        const user = await client.database.getUser(u, true);
        return user.votePrivacy ? null : u;
      })
    ).then((filteredIds) => filteredIds.filter((id) => id !== null));
    data2 = data2
      .map((s, i = 1) => `${i++}. <@${s}> (${s})`,);
    data2 = Array.from(
      {
        length: Math.ceil(data2.length / 10),
      },
      (a, r) => data2.slice(r * 10, r * 10 + 10),
    );

    Math.ceil(data2.length / 10);
    data2 = data2.map((e) =>
      page.add(
        new EmbedBuilder()
          .setTitle(`Voted "No"`)
          .setDescription(e.slice(0, 10).join("\n").toString())
          .setColor("#F00605"),
      ),
    );

    return await page.start(interaction);
  },
};
