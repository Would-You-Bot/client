const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
  } = require("discord.js");
  const fs = require("fs");
  const path = require("path");
  
  const HL = require("../util/Models/higherlowerModel");
  const LOSE = require("../util/Classes/generateLOSE.js");
  const HOR = require("../util/Classes/generateHOR.js");
  
  module.exports = {
    data: {
      name: "lower",
      description: "Lower vote",
    },
    async execute(interaction, client, guildDb) {

      if (interaction.message.interaction.user.id !== interaction.user.id)
      return interaction.reply({
        content: `${client.translation.get(
          guildDb?.language,
          "HigherLower.error.user",
          {
            user: interaction.message.interaction.user.username,
          },
        )}`,
        ephemeral: true,
      });

      const gameId = interaction.customId.split("_")[1];
      const game = await HL.findOne({ id: gameId });
  
      if (
        game.items.current.value <
        game.items.history[game.items.history.length - 1].value
      ) {
        game.score += 1;
        game.items.history.push(game.items.current);
  
        const gameDataRaw = fs.readFileSync(
          path.join(__dirname, "..", "data", "hl-en_EN.json"),
        );
        const gameData = JSON.parse(gameDataRaw).data;
  
        if (game.items.history.length == gameData.length)
          return interaction.reply({
            content: "No more data avalible",
            ephemeral: true,
          });
  
        interaction.deferReply({ ephemeral: true }).then(() => {
          interaction.deleteReply();
        });
  
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

        .setDescription(`${client.translation.get(
          guildDb?.language,
          "HigherLower.description",
          {
            keyword: game.items.current.keyword,
            history: game.items.history[game.items.history.length - 1].keyword,
          },
        )}`)
          .setColor("Green")
          .setImage("attachment://game.png")
          .setFooter({
            iconURL: interaction.user.avatarURL({ dynamic: true }),
            text: `${interaction.user.tag} | Game ID: ${game.id}`,
          })
          .setTimestamp();
  
        gameImage.build(game.score).then((image) => {
          const guessRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`higher_${game.id}`)
              .setLabel("Higher")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`lower_${game.id}`)
              .setLabel("Lower")
              .setStyle(ButtonStyle.Danger),
          );
  
          interaction.message.edit({
            embeds: [gameEmbed],
            files: [
              new AttachmentBuilder()
                .setFile(image)
                .setName("game.png")
                .setSpoiler(false),
            ],
            components: [guessRow],
          });
        });
      } else {
        const loseEmbed = new EmbedBuilder()
          .setTitle(client.translation.get(guildDb?.language, "HigherLower.game.title"))
          .setDescription(`${client.translation.get(
            guildDb?.language,
            "HigherLower.game.description",
            {
              score: game.score
            },
          )}`)
          .setColor("Red")
          .setImage("attachment://game.png")
          .setFooter({
            iconURL: interaction.user.avatarURL({ dynamic: true }),
            text: `${interaction.user.tag} | Game ID: ${game.id}`,
          })
          .setTimestamp();
  
        const gameImage = new LOSE();
        gameImage.setGame(game);
  
        gameImage.build(game.score).then((image) => {
          return interaction.message.edit({
            embeds: [loseEmbed],
            files: [
              new AttachmentBuilder()
                .setFile(image)
                .setName("game.png")
                .setSpoiler(false),
            ],
            components: [],
          });
        });
      }
    },
  };
  