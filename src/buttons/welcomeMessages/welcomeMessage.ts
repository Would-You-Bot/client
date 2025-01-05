import { EmbedBuilder, ActionRowBuilder, type MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";

const button: Button = {
  name: "welcomeMessage",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
      const { data } = await new Modal({
      title: "Set Welcome Message",
      customId: "welcomeMessage",
      fields: [
        {
          customId: "input",
          style: "paragraph",
          label: "What should the welcome message be?",
          required: true,
          placeholder: "Welcome to the server!",
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;

    if (!value || value.length > 300) {
      data?.modal.reply({
        embeds: [],
        content: "The welcome message must be less than 300 characters.",
        options: {
          ephemeral: true,
        },
      });
      return;
    }

    const truncateString = (str: string, maxLength: number) => {
      // Remove line breaks first
      const cleanedStr = str.replace(/\n/g, ' '); 
      return cleanedStr.length > maxLength ? `${cleanedStr.substring(0, maxLength)}...` : cleanedStr;
    };
    
  
    const welcomeEmbed = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, "Settings.embed.welcomeTitle"),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcome",
        )}: ${guildDb.welcome ? ":white_check_mark:" : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomePing",
        )}: ${guildDb.welcomePing ? ":white_check_mark:" : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyType",
        )}: ${guildDb.welcomeType}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeChannel",
        )}: ${guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeMessage",
        )}: ${
            truncateString(value, 100)
        }`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });
  
    // First button row
    // Deals with toggles
    const welcomeButtons1 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("welcomeType")
          .setEmoji("1185973664538177557")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyType",
            ),
          )
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("welcomeChannel")
          .setEmoji("1185973667973320775")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeChannel",
            ),
          )
          .setStyle(
            guildDb.welcomeChannel ? ButtonStyle.Primary : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("welcomeTest")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeTest",
            ),
          )
          .setDisabled(!guildDb.welcome)
          .setStyle(guildDb.welcome ? ButtonStyle.Primary : ButtonStyle.Secondary)
          .setEmoji("1207800685928910909"),
      );
  
    // Second button row
    // Deals with type, channel, test
    const welcomeButtons2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("welcome")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.welcome"),
          )
          .setStyle(
            guildDb.welcome ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("welcomePing")
          .setEmoji("1207801424503644260")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomePing",
            ),
          )
          .setStyle(
            guildDb.welcomePing ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
      );
  
      const welcomeButtons3 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("welcomeMessage")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.welcomeMessage"),
          )
          .setStyle(
            guildDb.welcomeMessage ? ButtonStyle.Primary : ButtonStyle.Secondary,
          )
      );

      await client.database.updateGuild(interaction.guild?.id || "", {
        ...guildDb,
        welcomeMessage: value,
      });

    await (data?.modal as any).update({
      embeds: [welcomeEmbed],
      components: [welcomeButtons1, welcomeButtons2, welcomeButtons3],
      content: null,
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
