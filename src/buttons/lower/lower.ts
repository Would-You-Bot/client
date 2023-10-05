import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { HigherlowerModel } from "../../util/Models/higherlowerModel";
import LOSE from "../../util/Classes/generateLOSE";
import HOR from "../../util/Classes/generateHOR";
import { Button } from "../../models";
import { getHigherLower } from "../../util/Functions/jsonImport";

const button: Button = {
  name: "lower",
  execute: async (interaction, client, guildDb) => {
    if (interaction.message.interaction?.user.id !== interaction.user.id) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "HigherLower.error.user",
          {
            user: interaction.message.interaction?.user.username,
          },
        ),
        ephemeral: true,
      });
      return;
    }

    await interaction.deferUpdate();

    const gameId = interaction.customId.split("_")[1];
    const game = await HigherlowerModel.findOne({ id: gameId });

    if (
      game &&
      game.items.current.value <
        game.items.history[game.items.history.length - 1].value
    ) {
      game.score += 1;
      game.items.history.push(game.items.current);

      const gameData = await getHigherLower();

      if (game.items.history.length == gameData.length) {
        interaction.followUp({
          content: "There is no more data available",
          ephemeral: true,
        });
        return;
      }

      let comperator = Math.floor(Math.random() * gameData.length);
      const regenerateComperator = () => {
        comperator = Math.floor(Math.random() * gameData.length);
        if (
          game.items.current.id == gameData[comperator].id ||
          game.items.history.find((i) => i.id == gameData[comperator].id)
        )
          regenerateComperator();
      };
      if (
        game.items.current.id == gameData[comperator].id ||
        game.items.history.find((i) => i.id == gameData[comperator].id)
      )
        regenerateComperator();

      game.items.current = gameData[comperator];

      game.save();

      const gameImage = new HOR();
      gameImage.setGame(game);
      gameImage.setImages([
        `https://cdn.wouldyoubot.gg/higherlower/${
          game.items.history[game.items.history.length - 1].id
        }.png`,
        `https://cdn.wouldyoubot.gg/higherlower/${game.items.current.id}.png`,
      ]);

      const gameEmbed = new EmbedBuilder()

        .setDescription(
          client.translation.get(guildDb?.language, "HigherLower.description", {
            keyword: game.items.current.keyword,
            history: game.items.history[game.items.history.length - 1].keyword,
            source: game.items.current.link,
            source2: game.items.history[game.items.history.length - 1].link,
          }),
        )
        .setColor("Green")
        .setImage("attachment://game.png")
        .setFooter({
          iconURL: interaction.user.avatarURL() || undefined,
          text: `${interaction.user.tag} | Game ID: ${game.id}`,
        })
        .setTimestamp();

      gameImage.build(game.score).then((image) => {
        const guessRow =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`higher_${game.id}`)
              .setLabel("Higher")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`lower_${game.id}`)
              .setLabel("Lower")
              .setStyle(ButtonStyle.Danger),
          );

        interaction.editReply({
          embeds: [gameEmbed],
          files: [
            new AttachmentBuilder(image)
              .setFile(image)
              .setName("game.png")
              .setSpoiler(false),
          ],
          components: [guessRow],
        });
      });
    } else {
      const loseEmbed = new EmbedBuilder()
        .setTitle(
          client.translation.get(guildDb?.language, "HigherLower.game.title"),
        )
        .setDescription(
          `${client.translation.get(
            guildDb?.language,
            "HigherLower.game.description",
            {
              score: game?.score,
            },
          )}`,
        )
        .setColor("Red")
        .setImage("attachment://game.png")
        .setFooter({
          iconURL: interaction.user.avatarURL() || undefined,
          text: `${interaction.user.tag} | Game ID: ${game?.id}`,
        })
        .setTimestamp();

      const gameImage = new LOSE();
      gameImage.setGame(game);

      gameImage.build(game?.score || 0).then((image) => {
        interaction.editReply({
          embeds: [loseEmbed],
          files: [
            new AttachmentBuilder(image)
              .setFile(image)
              .setName("game.png")
              .setSpoiler(false),
          ],
          components: [],
        });
        return;
      });
    }
  },
};

export default button;
