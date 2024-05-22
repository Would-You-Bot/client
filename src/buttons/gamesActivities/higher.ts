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
import { Button } from "../../interfaces";

import { getHigherLower } from "../../util/Functions/jsonImport";

const button: Button = {
  name: "higher",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    if (
      interaction.message.interaction?.user.id !== interaction.user.id &&
      interaction?.message.embeds[0]?.footer?.text.split(" | ")[0] !==
        interaction.user.tag
    ) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "HigherLower.error.user",
          {
            user: interaction.message.interaction?.user.username
              ? interaction.message.interaction?.user.username
              : interaction?.message.embeds[0]?.footer?.text.split(" | ")[0],
          },
        ),
        ephemeral: true,
      });
      return;
    }

    await interaction.deferUpdate();

    const gameId = interaction.customId.split("_")[1];
    var game = await HigherlowerModel.findOne({ id: gameId });

    if (
      game &&
      game?.items.current.value >=
        game?.items.history[game.items.history.length - 1].value
    ) {
      game.score += 1;
      game.items.history.push(game.items.current);

      var gameData = await getHigherLower();

      if (game.items.history.length == gameData.length) {
        interaction.followUp({
          content: "There is no more data available!",
          ephemeral: true,
        });
        return;
      }

      let comperator = Math.floor(Math.random() * gameData.length);
      const regenerateComperator = () => {
        comperator = Math.floor(Math.random() * gameData.length);
        if (
          game?.items.current.id == gameData[comperator].id ||
          game?.items.history.find((i) => i.id == gameData[comperator].id)
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
          client.translation.get(
            guildDb?.language != null ? guildDb.language : "en_EN",
            "HigherLower.description",
            {
              keyword: game.items.current.keyword,
              history:
                game.items.history[game.items.history.length - 1].keyword,
              source:
                game.items.current.link || "https://wouldyoubot.gg/nolink",
              source2:
                game.items.history[game.items.history.length - 1].link ||
                "https://wouldyoubot.gg/nolink",
            },
          ),
        )
        .setColor("Green")
        .setImage("attachment://game.png")
        .setFooter({
          iconURL: interaction.user.displayAvatarURL() || undefined,
          text: `${interaction.user.tag} | Game ID: ${game.id}`,
        })
        .setTimestamp();

      gameImage.build(game.score).then((image) => {
        const guessRow =
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId(`higher_${game?.id}`)
              .setLabel("Higher")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`lower_${game?.id}`)
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
          client.translation.get(
            guildDb?.language != null ? guildDb.language : "en_EN",
            "HigherLower.game.title",
          ),
        )
        .setDescription(
          `${client.translation.get(
            guildDb?.language != null ? guildDb.language : "en_EN",
            "HigherLower.game.description",
            {
              score: game?.score,
            },
          )}`,
        )
        .setColor("Red")
        .setImage("attachment://game.png")
        .setFooter({
          iconURL: interaction.user.displayAvatarURL() || undefined,
          text: `${interaction.user.tag} | Game ID: ${game?.id}`,
        })
        .setTimestamp();

      const mainRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();
      if (Math.round(Math.random() * 15) < 3) {
        mainRow.addComponents([
          new ButtonBuilder()
            .setLabel("Invite")
            .setStyle(5)
            .setEmoji("1009964111045607525")
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
            ),
        ]);
      }
      mainRow.addComponents([
        new ButtonBuilder()
          .setLabel("Try Again")
          .setStyle(1)
          .setEmoji("1073954835533156402")
          .setCustomId(`higherlower`)
          .setDisabled(guildDb?.replay != null ? !guildDb.replay : false),
      ]);

      const gameImage = new LOSE();
      gameImage.setGame(game);

      gameImage.build(game?.score || 0, client).then((image) => {
        interaction.editReply({
          embeds: [loseEmbed],
          components: [mainRow],
          files: [
            new AttachmentBuilder(image)
              .setFile(image)
              .setName("game.png")
              .setSpoiler(false),
          ],
        });
        return;
      });
    }
  },
};

export default button;
