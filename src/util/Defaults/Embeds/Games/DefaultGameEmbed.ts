import { bold, EmbedBuilder, CommandInteraction } from "discord.js";

export class DefaultGameEmbed extends EmbedBuilder  {
  constructor(
    interaction: CommandInteraction,
    Random: number,
    question: Array<string>,
    type: string,
  ) {
    super();

    const TypeMap: Map<string, string> = new Map([
      ["wyr", "WYR"],
      ["nhie", "NHIE"],
      ["wwyd", "WWYD"],
      ["truth", "TRUTH"],
      ["dare", "DARE"]
    ]);

    this.setColor("#0598F6");
    this.setFooter({
      text: `Requested by ${interaction.user.username} | Type: ${TypeMap.get(type)} | ID: ${Random}`,
      iconURL: interaction.user.displayAvatarURL() || undefined,
    });
    this.setDescription(bold(question[Random]));

  }
}
