import {
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    MessageActionRowComponentBuilder,
  } from "discord.js";
  import shuffle from "../../util/shuffle";
  import { captureException } from "@sentry/node";
  import { ChatInputCommand } from "../../models";
  import { getTruth } from "../../util/Functions/jsonImport";
  
  const command: ChatInputCommand = {
    requireGuild: true,
    data: new SlashCommandBuilder()
      .setName("truth")
      .setDescription("Post a random truth question")
      .setDMPermission(false)
      .setDescriptionLocalizations({
        de: "Sende eine zufällige wahrheits frage",
        "es-ES": "Publicar una pregunta de verdad al azar",
        fr: "Publier une question de vérité aléatoire",
      }),
  
    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    execute: async (interaction, client, guildDb) => {
      var Truth = await getTruth(guildDb.language);
        console.log(Truth)
      const dbquestions = guildDb.customMessages.filter(
        (c) => c.type !== "nsfw" && c.type === "truth",
      );
  
      let truthordare = [] as string[];
  
      if (!dbquestions.length) guildDb.customTypes = "regular";
  
      switch (guildDb.customTypes) {
        case "regular":
            truthordare = shuffle([...Truth]);
          break;
        case "mixed":
            truthordare = shuffle([
            ...Truth,
            ...dbquestions.map((c) => c.msg),
          ]);
          break;
        case "custom":
            truthordare = shuffle(dbquestions.map((c) => c.msg));
          break;
      }
  
      const Random = Math.floor(Math.random() * truthordare.length);
  
      const truthembed = new EmbedBuilder()
        .setColor("#0598F6")
        .setFooter({
          text: `Requested by ${interaction.user.username} | Type: Random | ID: ${Random}`,
          iconURL: interaction.user.avatarURL() || "",
        })
        .setDescription(truthordare[Random]);
  
      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
      if (Math.round(Math.random() * 15) < 3) {
        row.addComponents([
          new ButtonBuilder()
            .setLabel("Invite")
            .setStyle(5)
            .setEmoji("1009964111045607525")
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
            ),
        ]);
      }
      row.addComponents([
        new ButtonBuilder()
          .setLabel("Truth")
          .setStyle(1)
          .setCustomId(`truth`),
          new ButtonBuilder()
          .setLabel("Dare")
          .setStyle(2)
          .setCustomId(`dare`),
          new ButtonBuilder()
          .setLabel("Random")
          .setStyle(3)
          .setCustomId(`random`),
      ]);
  
      interaction
        .reply({ embeds: [truthembed], components: [row] })
        .catch((err) => {
          captureException(err);
        });
    },
  };
  
  export default command;
  