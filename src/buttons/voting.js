const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Either = require("../util/generateEither");

module.exports = {
  data: {
    name: "voting",
    description: "Voting",
  },
  async execute(interaction, client, guildDb) {
    const [prefix,votingId,action] = interaction.customId.split("_");

    const vote = await client.voting.getVoting(votingId);
    if (!vote) return interaction.reply({ content: "Voting not found", ephemeral: true });

    if (action === "results") {
        const results = await client.voting.getVotingResults(votingId);

        let g;
        if (vote.guildId !== null && typeof vote.guildId === 'string') g = client.database.getGuild(String(vote.guildId));

        const embed = new EmbedBuilder()
            .setTitle(client.translation.get(g?.language ?? 'en_EN', 'Voting.VotingResults'))
            .setColor("#0598F6")
            .setImage(results.chart);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (action == "1" || action == "2") {
        await client.voting.addVote(vote.id, interaction.user.id, Number(action), interaction.user.icon ? interaction.user.iconURL({forceStatic:true, size:128}) : interaction.user.defaultAvatarURL);
        interaction.reply({ content: `Voted for ${action}`, ephemeral: true });
        return;
    }

    interaction.reply({ content: "Uhhh, this wasn't suppose to happen... This button has no code...", ephemeral: true });
  },
};
