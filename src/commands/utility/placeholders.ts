import { captureException } from "@sentry/node";
import {
  EmbedBuilder,
 type GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import type { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  cooldown: true,
  data: new SlashCommandBuilder()
    .setName("placeholders")
    .setDescription("Gives you a list of placeholders that you can use in your welcome messages")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDescriptionLocalizations({
      de: "Gibt dir eine Liste von Platzhaltern, die du in deinen Willkommensnachrichten verwenden kannst",
      "es-ES": "Te da una lista de marcadores de posición que puedes usar en tus mensajes de bienvenida",
      fr: "Vous donne une liste de placeholders que vous pouvez utiliser dans vos messages de bienvenue",
      it: "Ti fornisce un elenco di segnaposto che puoi utilizzare nei tuoi messaggi di benvenuto",
    }),

  execute: async (interaction, client, guildDb) => {

    const member = interaction.member as GuildMember;

    const placeholderMap: Record<string, string> = {
      "{{user_displayname}}": member.user.displayName,
      "{{user_tag}}": member.user.username,
      "{{user_avatarUrl}}": member.user.avatarURL() ?? "https://cdn.discordapp.com/embed/avatars/5.png",
      "{{@mention}}": `<@${member.user.id}>`,
      "{{guild_name}}": member.guild.name,
      "{{guild_member_count}}": member.guild.memberCount.toString(),
      "{{guild_iconUrl}}": member.guild.iconURL() ?? "https://cdn.discordapp.com/embed/avatars/5.png",
      "{{question}}": client.translation.get(guildDb.language, "Placeholders.embed.question"),
      "{{new_line}}": "\\n",
    };

    const placeholderEmbed = new EmbedBuilder()
      .setColor("#0598F6")
      .setTitle(client.translation.get(guildDb.language, "Placeholders.embed.title"))
      .addFields( 
        ...Object.entries(placeholderMap).map(([placeholder, value]) => ({
        name: placeholder,
        value: value,
        inline: false,
      })),
      );
    
    await interaction
      .reply({
        embeds: [placeholderEmbed],
        ephemeral: true,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
