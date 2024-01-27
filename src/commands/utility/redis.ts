import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    MessageActionRowComponentBuilder,
  } from "discord.js";
  import { captureException } from "@sentry/node";
  import { ChatInputCommand } from "../../models";
  
  const command: ChatInputCommand = {
    requireGuild: true,
    data: new SlashCommandBuilder()
      .setName("redis")
      .setDescription("tests redis"),

  
    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    execute: async (interaction, client, guildDb) => {
      
        await client.redis.addQuestionCache("1009562516105461780", "123")

        console.log(client.redis.getQuestionCache("1009562516105461780"))

        await interaction.reply({content: "Done", ephemeral: true})
    },
  };
  
  export default command;
  