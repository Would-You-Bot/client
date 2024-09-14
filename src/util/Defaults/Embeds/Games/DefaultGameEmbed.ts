import { EmbedBuilder, bold, type CommandInteraction } from "discord.js";

export class DefaultGameEmbed extends EmbedBuilder {
  constructor(
    interaction: CommandInteraction,
    id: string,
    question: string,
    type: string,
  ) {
    super();

    this.setColor("#0598F6");
    this.setFooter({
      text: `Requested by ${interaction.user.username} | Type: ${type.toUpperCase()} | ID: ${id}`,
      iconURL: interaction.user.displayAvatarURL() || undefined,
    });
    this.setDescription(bold(question));
  }
}
