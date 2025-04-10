import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  StringSelectMenuBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
export function embed({
  client,
  guildDb,
  content = guildDb.welcomeEmbedContent || "❌",
  title = guildDb.welcomeEmbedTitle || "❌",
  titleURL = guildDb.welcomeEmbedTitleURL || "❌",
  description = guildDb.welcomeEmbedDescription || "❌",
  author = guildDb.welcomeEmbedAuthorName || "❌",
  authorURL = guildDb.welcomeEmbedAuthorURL || "❌",
  thumbnail = guildDb.welcomeEmbedThumbnail || "❌",
  image = guildDb.welcomeEmbedImage || "❌",
  footer = guildDb.welcomeEmbedFooterText || "❌",
  footerURL = guildDb.welcomeEmbedFooterURL || "❌",
  color = guildDb.welcomeEmbedColor || "❌",
  timestamp = guildDb.welcomeEmbedTimestamp,
  toggle = guildDb.welcomeEmbed || "❌",
}: {
  client: any;
  guildDb: any;
  content?: string;
  title?: string;
  titleURL?: string;
  description?: string;
  author?: string;
  authorURL?: string;
  thumbnail?: string;
  image?: string;
  footer?: string;
  footerURL?: string;
  color?: ColorResolvable;
  timestamp?: boolean;
  toggle?: boolean;
}) {
  return new EmbedBuilder()
    .setTitle(
      client.translation.get(guildDb?.language, "Settings.embed.welcomeTitle")
    )
    .setFields([
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeContent"
        ),
        value: `\`\`\`${content.slice(0, 400)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTitles"
        ),
        value: `\`\`\`${title.slice(0, 100)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTitlesURL"
        ),
        value: `\`\`\`${titleURL.slice(0, 30)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeDescription"
        ),
        value: `\`\`\`${description.slice(0, 800)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeAuthorName"
        ),
        value: `\`\`\`${author.slice(0, 100)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeAuthorURL"
        ),
        value: `\`\`\`${authorURL.slice(0, 30)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeThumbnailURL"
        ),
        value: `\`\`\`${thumbnail.slice(0, 30)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeFooterText"
        ),
        value: `\`\`\`${footer.slice(0, 100)}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeFooterURL"
        ),
        value: `\`\`\`${footerURL.slice(0, 50)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeImageURL"
        ),
        value: `\`\`\`${image.slice(0, 50)}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeColor"
        ),
        value: `\`\`\`${color}\`\`\``,
        inline: false,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTimestamp"
        ),
        value: `\`\`\`${timestamp === true ? "✅" : "❌"}\`\`\``,
        inline: true,
      },
      {
        name: client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeToggle"
        ),
        value: `\`\`\`${toggle === true ? "✅" : "❌"}\`\`\``,
        inline: true,
      },
    ])
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });
}

export function Button1({
  client,
  guildDb,
  title = guildDb?.welcomeEmbedTitle
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  description = guildDb?.welcomeEmbedDescription
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,

  author = guildDb?.welcomeEmbedAuthorName
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  authorURL = guildDb?.welcomeEmbedAuthorURL
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  title?: ButtonStyle;
  description?: ButtonStyle;
  author?: ButtonStyle;
  authorURL?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedTitle")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedTitle"
        )
      )
      .setStyle(title)
      .setEmoji("1185973664538177557"),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedDescription")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedDescription"
        )
      )
      .setStyle(description),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedAuthorName")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedAuthorName"
        )
      )
      .setStyle(author),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedAuthorURL")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedAuthorURL"
        )
      )
      .setStyle(authorURL)
      .setEmoji("1185973664538177557")
  );
}

export function Button2({
  client,
  guildDb,
  thumbnail = guildDb?.welcomeEmbedThumbnail
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  image = guildDb?.welcomeEmbedImage
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  timestamp = guildDb?.welcomeEmbedTimestamp
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  thumbnail?: ButtonStyle;
  image?: ButtonStyle;
  timestamp?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedThumbnail")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedThumbnail"
        )
      )
      .setStyle(thumbnail),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedImage")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedImage"
        )
      )
      .setStyle(image),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedTimestamp")
      .setEmoji("1185973660465500180")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedTimestamp"
        )
      )
      .setStyle(timestamp)
  );
}

export function Button3({
  client,
  guildDb,
  footer = guildDb?.welcomeEmbedFooterText
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  footerURL = guildDb?.welcomeEmbedFooterURL
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  color = guildDb?.welcomeEmbedColor
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
}: {
  client: any;
  guildDb: any;
  footer?: ButtonStyle;
  footerURL?: ButtonStyle;
  color?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedFooterText")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedFooterText"
        )
      )
      .setStyle(footer),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedFooterURL")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedFooterURL"
        )
      )
      .setStyle(footerURL),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedColor")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedColor"
        )
      )
      .setStyle(color)
  );
}

export function Button4({
  client,
  guildDb,
  content = guildDb?.welcomeEmbedContent
    ? ButtonStyle.Success
    : ButtonStyle.Secondary,
  toggle = guildDb?.welcomeEmbed ? ButtonStyle.Success : ButtonStyle.Secondary,
  embed = ButtonStyle.Primary,
}: {
  client: any;
  guildDb: any;
  content?: ButtonStyle;
  toggle?: ButtonStyle;
  embed?: ButtonStyle;
}) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("welcomeEmbedContent")
      .setEmoji("1185973664538177557")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedContent"
        )
      )
      .setStyle(content),
    new ButtonBuilder()
      .setCustomId("welcomeEmbedToggle")
      .setEmoji("1185973660465500180")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedToggle"
        )
      )
      .setStyle(toggle),
    new ButtonBuilder()
      .setCustomId("welcomeEmbed")
      .setEmoji("1308672399188820023")
      .setLabel(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbed"
        )
      )
      .setStyle(embed)
  );
}

export function SelectMenu(client: any, guildDb: any) {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("selectMenuWelcomeEmbed")
      .setPlaceholder(
        client.translation.get(
          guildDb?.language,
          "Settings.button.welcomeEmbedDeleteSettings"
        )
      )
      .addOptions([
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedAuthorNameMenu"
          ),
          value: "author",
          description: "Delete the author name.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedAuthorURLMenu"
          ),
          value: "authorURL",
          description: "Delete the author URL.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedTitleMenu"
          ),
          value: "title",
          description: "Delete the title.",
        },
        {
          label:
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeEmbedTitleMenu"
            ) + " URL",
          value: "titleURL",
          description: "Delete the title URL.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedDescriptionMenu"
          ),
          value: "description",
          description: "Delete the description.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedContentMenu"
          ),
          value: "content",
          description: "Delete the content.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedThumbnailMenu"
          ),
          value: "thumbnail",
          description: "Delete the thumbnail.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedImageMenu"
          ),
          value: "image",
          description: "Delete the image.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedFooterTextMenu"
          ),
          value: "footer",
          description: "Delete the footer text.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedFooterURLMenu"
          ),
          value: "footerURL",
          description: "Delete the footer URL.",
        },
        {
          label: client.translation.get(
            guildDb?.language,
            "Settings.button.welcomeEmbedColorMenu"
          ),
          value: "color",
          description: "Delete the color.",
        },
      ])
  );
}

const button: Button = {
  name: "welcomeEmbedEdit",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const welcomes = embed({ client: client, guildDb: guildDb });

    const welcomeButtons = Button1({ client: client, guildDb: guildDb });
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = SelectMenu(client, guildDb);

    interaction.update({
      content: null,
      embeds: [welcomes],
      components: [
        welcomeButtons,
        welcomeButtons2,
        welcomeButtons3,
        welcomeButtons4,
        welcomeButtons5,
      ],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
