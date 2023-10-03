import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { readFileSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import HOR from "../../util/Classes/generateHOR";
import { ChatInputCommand } from "../../models";
import { HigherlowerModel } from "../../util/Models/higherlowerModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("higherlower")
    .setDescription("Starts the higher or lower game")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Starte das Higher or Lower spiel",
      "es-ES": "Iniciar el juego Higher or Lower",
      fr: "Démarrer le jeu Higher or Lower",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */

  execute: async(interaction, client, guildDb) => {
    const initembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setTitle(
        client.translation.get(guildDb?.language, "HigherLower.initial.title"),
      )
      .setDescription(
        client.translation.get(
          guildDb?.language,
          "HigherLower.initial.description",
        ),
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL() || "",
      });

    interaction.reply({ embeds: [initembed] }).then((async) => {
      const gameDataRaw = readFileSync(
        path.join(__dirname, "..", "data", "hl-en_EN.json"),
      ) as any;
      const gameData = JSON.parse(gameDataRaw).data;

      const random = Math.floor(Math.random() * gameData.length);
      let comperator = Math.floor(Math.random() * gameData.length);

      const regenerateComperator = () => {
        comperator = Math.floor(Math.random() * gameData.length);
        if (comperator == random) regenerateComperator();
      };
      if (comperator == random) regenerateComperator();

      const game = new HigherlowerModel({
        creator: interaction.user.id,
        created: new Date(),
        id: uuidv4(),
        guild: interaction.guild?.id,
        items: {
          current: gameData[random],
          history: [gameData[comperator]],
        },
        score: 0,
      });

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
          `${client.translation.get(
            guildDb?.language,
            "HigherLower.description",
            {
              keyword: game.items.current.keyword,
              history:
                game.items.history[game.items.history.length - 1].keyword,
              source: game.items.current.link,
              source2: game.items.history[game.items.history.length - 1].link,
            },
          )}`,
        )
        .setColor("White")
        .setImage("attachment://game.png")
        .setFooter({
          iconURL: interaction.user.avatarURL() || "",
          text: `${interaction.user.tag} | Game ID: ${game.id}`,
        })
        .setTimestamp();

      gameImage.build(game.score).then(async (image) => {
        const guessRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
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
    });
  },
};

export default command;
