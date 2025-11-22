import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  type GuildMember,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "welcomePlaceholders",
  cooldown: false,
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
    
    const inter = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
            .setCustomId("welcomeEmbed")
            .setEmoji("1308672399188820023")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.welcomeEmbed"
              )
            )
            .setStyle(ButtonStyle.Primary)
    );

    interaction.update({
      embeds: [placeholderEmbed],
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
