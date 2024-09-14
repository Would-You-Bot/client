import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import { R2 } from "node-cloudflare-r2";
import { v4 as uuid } from "uuid";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";

const button: Button = {
  name: "webhookAvatar",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const premium = await client.premium.check(interaction.guildId);

    if (!premium.result) {
      interaction.reply({
        content: client.translation.get(guildDb?.language, "Settings.premium"),
        ephemeral: true,
      });
      return;
    }

    const { data } = await new Modal({
      title: "Custom Avatar",
      customId: "webhookAvatarModal",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "Provide a Discord attachment link",
          required: true,
          placeholder: "Please provide a valid format: PNG, JPG, GIF, WEBP",
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;
    const regex =
      /https?:\/\/(www.|i.|cdn.|media.)discordapp\.(com|net)\/attachments\/[^\s]+\/[^\s]+\/[^\s]+(.png|.jpg|.gif|.jpeg|.webp)/g;

    if (!regex.test(value!)) {
      data?.modal.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.invalidLink",
        ),
        ephemeral: true,
      });
      return;
    }

    const emb = new EmbedBuilder()
      .setTitle("Would You - Utility")
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.username",
        )}: ${guildDb.webhookName}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.avatar",
        )}: [Image](<${value}>)\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.classicMode",
        )}: ${guildDb.classicMode ? ":white_check_mark:" : ":x:"}`,
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
          .setCustomId("webhookName")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.name"),
          )
          .setStyle(
            guildDb.webhookName ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("webhookAvatar")
          .setEmoji("1207801424503644260")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.avatar"),
          )
          .setStyle(ButtonStyle.Success),
      );

    const button2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("classicMode")
          .setEmoji("1256977616242606091")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.classicMode",
            ),
          )
          .setStyle(
            guildDb.classicMode ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
      );

    async function getImageData() {
      return fetch(value!)
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
    }

    const r2 = new R2({
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    });

    const bucket = r2.bucket("would-you");
    const image = await getImageData();
    const upload = await bucket.upload(
      image,
      `${guildDb.guildID}-${uuid()}`,
      undefined,
      "image",
    );

    if (!upload.objectKey) {
      data?.modal.reply({
        content: "An error occurred while uploading the image",
        ephemeral: true,
      });
      return;
    }

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      webhookAvatar: `https://bucket.wouldyoubot.gg/${upload.objectKey}`,
    });

    await (data?.modal as any).update({
      embeds: [emb],
      components: [button, button2],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
