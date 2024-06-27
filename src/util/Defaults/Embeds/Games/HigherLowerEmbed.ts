import { CommandInteraction, EmbedBuilder } from "discord.js";
import { IGuildModel } from "../../../Models/guildModel";
import WouldYou from "../../../wouldYou";

export class HigherLowerEmbed extends EmbedBuilder {
  constructor(
    interaction: CommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ) {
    super();

    this.setColor("#0598F6");
    this.setTitle(
      client.translation.get(
        guildDb?.language != null ? guildDb.language : "en_EN",
        "HigherLower.initial.title",
      ),
    );
    this.setDescription(
      client.translation.get(
        guildDb?.language != null ? guildDb.language : "en_EN",
        "HigherLower.initial.description",
      ),
    ).setFooter({
      text: "Requested by " + interaction.user.username,
      iconURL: interaction.user.displayAvatarURL() || undefined,
    });
  }
}
