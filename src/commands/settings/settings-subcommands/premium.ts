import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { IGuildModel } from "../../../util/Models/guildModel";
import WouldYou from "../../../util/wouldYou";

export default async function settingsGeneral(
  interaction: ChatInputCommandInteraction,
  client: WouldYou,
  guildDb: IGuildModel,
) {
  const prem = await client.premium.check(interaction.guildId);
  const premium = new EmbedBuilder()
    .setTitle(`Premium`)
    .setDescription(
      `${client.translation.get(guildDb?.language, "Premium.tier", { type: prem.tierName })}`, //TODO: Make this work with improved premium handler
    )
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });

  const premiumTiers =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(client.translation.get(guildDb?.language, "Premium.tier1"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://wouldyoubot.gg/premium"),
    );

  interaction.reply({
    embeds: [premium],
    components: [premiumTiers],
    ephemeral: true,
  });
}
