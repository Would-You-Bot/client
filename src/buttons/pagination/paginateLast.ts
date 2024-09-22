import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

import { assignRanks } from "../../util/Functions/number";
import { UserModel } from "../../util/Models/userModel";

const button: Button = {
  name: "paginateLast",
  cooldown: false,
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
        type === "leaderboard" &&
        client.paginate.get(
          `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
        );
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

    const embed = paginate.pages[paginate.pages.length - 1];
    let data;

    if (
      type === "leaderboard" &&
      !paginate.countedPages.includes(paginate.pages.length - 1)
    ) {
      paginate.countedPages.push(paginate.pages.length - 1);

      if (paginate.type === "global") {
        data = await UserModel.find({
          "higherlower.highscore": { $gt: 1 },
        })
          .sort({ "higherlower.highscore": -1 })
          .skip((paginate.pages.length - 1) * 10)
          .limit(10);

        data = await Promise.all(
          data.map(async (u: any) => {
            const user = await client.database.getUser(u.userID, true);
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
      } else {
        data = await Promise.all(
          guildDb.gameScores
            .filter((u: any) => u.higherlower >= 1)
            .sort((a: any, b: any) => b.higherlower - a.higherlower)
            .slice((paginate.pages.length - 1) * 10)
            .map(async (u: any) => {
              const user = await client.database.getUser(u.userID, true);
              return user?.votePrivacy
                ? {
                    user: "Anonymous",
                    score: u.higherlower,
                  }
                : {
                    user: u.userID,
                    score: u.higherlower,
                  };
            }),
        );
      }

      data = assignRanks(data, (paginate.pages.length - 1) * 10);
      data = data.map(
        (s: any) =>
          `${s.rank}․ ${s.user === "Anonymous" ? s.user : `<@${s.user}>`} • **${s.score}** ${client.translation.get(
            guildDb.language,
            "Leaderboard.points",
          )}`,
      );

      embed.data.description = data?.join("\n");
    }

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
      embeds: [paginate.pages[paginate.pages.length - 1]],
      components: [buttons],
      options: {
        ephemeral: true,
      },
    });

    paginate.page = paginate.pages.length - 1;
  },
};

export default button;
