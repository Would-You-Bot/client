import { Button } from "../models";
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";

const button: Button = {
  name: "privacy",
  execute: async (interaction, client, guildDb) => {
    const db = await client.database.getUser(interaction.user.id);

    const setting = new EmbedBuilder()
      .setTitle(client.translation.get(guildDb?.language, "Privacy.settings"))
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Privacy.desc",
        )}\n\n${client.translation.get(guildDb?.language, "Privacy.status")} ${
          db?.votePrivacy
            ? client.translation.get(guildDb?.language, "Privacy.off")
            : client.translation.get(guildDb?.language, "Privacy.on")
        }`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("privacy")
          .setLabel(
            db?.votePrivacy
              ? client.translation.get(guildDb?.language, "Privacy.turnOn")
              : client.translation.get(guildDb?.language, "Privacy.turnOff"),
          )
          .setStyle(db?.votePrivacy ? ButtonStyle.Success : ButtonStyle.Danger),
      );

    await interaction.update({
      embeds: [setting],
      components: [button],
    });

    await client.database.updateUser(interaction.user.id, {
      votePrivacy: db?.votePrivacy ? false : true,
    });
  },
};

export default button;
