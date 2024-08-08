import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";
import { assignRanks } from "../../util/Functions/number";
import { UserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "paginateUser",
  cooldown: true,
  execute: async (interaction, client, guildDb) => {
    let type: string | null = null;
    let paginate = client.paginate.get(
      `${interaction.user.id}-${interaction.message.interaction?.id}`,
    );

    if (!paginate)
      (paginate = client.paginate.get(
        `${interaction.user.id}-reference-${interaction.message.reference?.messageId}`,
      )),
        (type = "reference");

    if (!paginate)
      (paginate = client.paginate.get(
        `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
      )),
        (type = "leaderboard");

    if (!paginate)
      (paginate = client.paginate.get(`${interaction.user.id}-custom`)),
        (type = "custom");

    if (!paginate) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "wyCustom.error.issue",
        ),
        ephemeral: true,
      });
      return;
    }

    if (paginate.pages.length === 1) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "wyCustom.error.noPages",
        ),
        ephemeral: true,
      });
      return;
    }

    clearTimeout(paginate.timeout);
    const time = setTimeout(() => {
      if (
        type === "leaderboard" &&
        client.paginate.get(
          `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
        );
      } else if (
        type === "reference" &&
        client.paginate.get(
          `${interaction.user.id}-reference-${interaction.message.reference?.messageId}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-reference-${interaction.message.reference?.messageId}`,
        );
      } else if (
        type === "custom" &&
        client.paginate.get(`${interaction.user.id}-custom`)
      ) {
        client.paginate.delete(`${interaction.user.id}-custom`);
      } else if (
        client.paginate.get(
          `${interaction.user.id}-${interaction.message.interaction?.id}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-${interaction.message.interaction?.id}`,
        );
      }
    }, paginate.time);
    paginate.timeout = time;

    let embed;
    let data;

    if (
      type === "leaderboard" &&
      !paginate.countedPages.includes(paginate.page)
    ) {
      data = await UserModel.find({
        "higherlower.highscore": { $gt: 2 },
      })
        .sort({ "higherlower.highscore": -1 })
        .limit(paginate.pages.length * paginate.pages.length)
        .select("userID higherlower.highscore");

      const user = data.findIndex(
        (u) => String(u.userID) === interaction.user.id,
      );

      if (!user || data[user].higherlower.highscore < 2) {
        interaction.reply({
          content: ":(",
        });
        return;
      }

      const usersPerPage = Math.ceil(data.length / paginate.pages.length);
      const usersPage = Math.ceil((user + 1) / usersPerPage);

      const startIndex = (usersPage - 1) * 10;
      const endIndex = startIndex + 10;

      embed = paginate.pages[usersPage - 1];
      paginate.page = usersPage - 1;
      paginate.countedPages.push(paginate.page);

      data = data.slice(startIndex, endIndex); // Slice data for current page

      data = await Promise.all(
        data.map(async (u) => {
          const user = await client.database.getUser(String(u.userID), true);
          return user?.votePrivacy
            ? {
                user: "Anonymous",
                score: u.higherlower.highscore,
              }
            : {
                user: u.userID,
                score: u.higherlower.highscore,
              };
        }),
      );

      data = assignRanks(data, startIndex);
      data = data.map(
        (s) =>
          `${s.rank}․ ${s.user === "Anonymous" ? s.user : `<@${s.user}>`} • **${s.score}** ${client.translation.get(
            guildDb.language,
            "Leaderboard.points",
          )} ${s.user === interaction.user.id ? `⭐` : ``}`,
      );
    }

    embed.data.description = data?.join("\n");

    if (paginate.page + 1 === paginate.pages.length) {
      const buttons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("paginateFirst")
            .setLabel("⏪")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("paginatePrev")
            .setLabel("◀️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setDisabled(true)
            .setCustomId("paginateNext")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setDisabled(true)
            .setCustomId("paginateLast")
            .setLabel("⏩")
            .setStyle(ButtonStyle.Secondary),
        );

      await interaction.update({
        embeds: [embed],
        components: [buttons],
        options: {
          ephemeral: true,
        },
      });
      return;
    } else {
      const buttons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("paginateFirst")
            .setLabel("⏪")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("paginatePrev")
            .setLabel("◀️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("paginateNext")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("paginateLast")
            .setLabel("⏩")
            .setStyle(ButtonStyle.Secondary),
        );

      await interaction.update({
        embeds: [embed],
        components: [buttons],
        options: {
          ephemeral: true,
        },
      });
      return;
    }
  },
};

export default button;
