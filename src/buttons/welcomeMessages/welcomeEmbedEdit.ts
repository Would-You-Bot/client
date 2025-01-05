import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
export function embed({
  client,
  guildDb,
  content = guildDb?.content ||
    '❌',
  title = guildDb?.title ||
    '❌',
  description = guildDb?.description ||
    '❌',
  author = guildDb?.author ||
    '❌',
  authorURL = guildDb?.authorURL ||
    '❌',
  thumbnail = guildDb?.thumbnail ||
    '❌',
  image = guildDb?.image ||
    '❌',
  footerText = guildDb?.footerText ||
    '❌',
  footerURL = guildDb?.footerURL ||
    '❌',
  color = guildDb?.color ||
    '❌',
  timestamp = guildDb?.timestamp ||
    '❌',
}: {
  client: any;
  guildDb: any;
  content?: string;
  title?: string;
  description?: string;
  author?: string;
  authorURL?: string;
  thumbnail?: string;
  image?: string;
  footerText?: string;
  footerURL?: string;
  color?: string;
  timestamp?: string;
}) {
  return new EmbedBuilder()
    .setTitle(
      client.translation.get(guildDb?.language, "Settings.embed.welcomeTitle")
    )
    .setFields([
      { name: "Content", value: `\`\`\`${content}\`\`\``, inline: false },
      { name: "Title", value: `\`\`\`${title}\`\`\``, inline: false },
      {
        name: "Description",
        value: `\`\`\`${description}\`\`\``,
        inline: false,
      },
      { name: "Author name", value: `\`\`\`${author}\`\`\``, inline: false },
      {
        name: "Author Icon URL",
        value: `\`\`\`${authorURL}\`\`\``,
        inline: true,
      },
      {
        name: "Thumbnail URL",
        value: `\`\`\`${thumbnail}\`\`\``,
        inline: true,
      },
      {
        name: "Footer Text",
        value: `\`\`\`${footerText}\`\`\``,
        inline: false,
      },
      {
        name: "Footer Icon URL",
        value: `\`\`\`${footerURL}\`\`\``,
        inline: true,
      },
      { name: "Image URL", value: `\`\`\`${image}\`\`\``, inline: true },
      { name: "Color", value: `\`\`\`${color}\`\`\``, inline: true },
      { name: "Timestamp", value: `\`\`\`${timestamp}\`\`\``, inline: true },
    ])
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });
}

export function Button1(client: any, guildDb: any) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedTitle")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedTitle"
        )
      )
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("1185973667973320775"),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedAuthorName")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedAuthorName"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedAuthorURL")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedAuthorURL"
        )
      )
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("1185973667973320775")
  );
}

export function Button2(client: any, guildDb: any) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedDescription")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedDescription"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedThumbnail")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedThumbnail"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedImage")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedImage"
        )
      )
      .setStyle(ButtonStyle.Secondary)
  );
}

export function Button3(client: any, guildDb: any) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedFooterText")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedFooterText"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedFooterURL")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedFooterURL"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedColor")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedColor"
        )
      )
      .setStyle(ButtonStyle.Secondary)
  );
}

export function Button4(client: any, guildDb: any) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedTimestamp")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedTimestamp"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedContent")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedContent"
        )
      )
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("welcomeEmbed")
      .setEmoji("1185973667973320775")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbed"
        )
      )
      .setStyle(ButtonStyle.Secondary)
  );
}

const button: Button = {
  name: "welcomeEmbedEdit",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const welcomes = embed({ client: client, guildDb: guildDb });

    const welcomeButtons = Button1(client, guildDb);
    const welcomeButtons2 = Button2(client, guildDb);
    const welcomeButtons3 = Button3(client, guildDb);
    const welcomeButtons4 = Button4(client, guildDb);

    interaction.update({
      content: null,
      embeds: [welcomes],
      components: [
        welcomeButtons,
        welcomeButtons2,
        welcomeButtons3,
        welcomeButtons4,
      ],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
