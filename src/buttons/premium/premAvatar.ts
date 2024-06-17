import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";
import { captureException } from "@sentry/node";

const modalObject = {
  title: "Custom Avatar",
  custom_id: "premAvatarModal",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          style: 1,
          custom_id: "input",
          label: "Provide a Discord attachment link",
          placeholder:
            "Please provide a valid format: PNG, JPG, GIF",
          required: true,
        },
      ],
    },
  ],
};

const button: Button = {
  name: "premAvatar",
  cooldown: false,
    execute: async (interaction, client, guildDb) => {
        try {
        if (!guildDb.premium) {
            interaction.reply({
                content: client.translation.get(guildDb?.language, "Settings.premium"),
                ephemeral: true,
            });
            return;
        }
        await interaction.showModal(modalObject);

        interaction
            .awaitModalSubmit({
                filter: (mInter) => mInter.customId === modalObject.custom_id,
                time: 600000,
            })
            .then(async (modalInteraction) => {
                let value = modalInteraction.components[0].components[0].value as any;
                let regex =
                    /https?:\/\/(www.|i.|)cdn\.discordapp\.com\/attachments\/[^\s]+\/[^\s]+\/[^\s]+(.png|.jpg|.gif|.jpeg)/g;

                if (!regex.test(value))
                    return modalInteraction.reply({
                        content: client.translation.get(
                            guildDb?.language,
                            "Settings.invalidLink",
                        ),
                        ephemeral: true,
                    });
                const emb = new EmbedBuilder()
                    .setTitle("Would You - Utility")
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
                            "Settings.embed.username",
                        )}: ${guildDb.premName}\n${client.translation.get(
                            guildDb?.language,
                            "Settings.embed.avatar",
                        )}: [Image](<${value}>)`,
                    )
                    .setColor("#0598F6")
                    .setFooter({
                        text: client.translation.get(
                            guildDb?.language,
                            "Settings.embed.footer",
                        ),
                        iconURL: client?.user?.displayAvatarURL() || undefined,
                    });

                const button2 =
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
                                guildDb.welcomeChannel
                                    ? ButtonStyle.Primary
                                    : ButtonStyle.Secondary,
                            ),
                        new ButtonBuilder()
                            .setCustomId("welcomeTest")
                            .setLabel(
                                client.translation.get(
                                    guildDb?.language,
                                    "Settings.button.welcomeTest",
                                ),
                            )
                            .setDisabled(guildDb.welcome ? false : true)
                            .setStyle(
                                guildDb.welcome ? ButtonStyle.Primary : ButtonStyle.Secondary,
                            )
                            .setEmoji("1207800685928910909"),
                    );

                const button1 =
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("welcome")
                            .setEmoji("1185973660465500180")
                            .setLabel(
                                client.translation.get(
                                    guildDb?.language,
                                    "Settings.button.welcome",
                                ),
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
                                guildDb.welcomePing
                                    ? ButtonStyle.Success
                                    : ButtonStyle.Secondary,
                            ),
                    );

                const button3 =
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("premName")
                            .setEmoji("1185973660465500180")
                            .setLabel(
                                client.translation.get(
                                    guildDb?.language,
                                    "Settings.button.name",
                                ),
                            )
                            .setStyle(
                                guildDb.premName ? ButtonStyle.Success : ButtonStyle.Secondary,
                            ),
                        new ButtonBuilder()
                            .setCustomId("premAvatar")
                            .setEmoji("1207801424503644260")
                            .setLabel(
                                client.translation.get(
                                    guildDb?.language,
                                    "Settings.button.avatar",
                                ),
                            )
                            .setStyle(ButtonStyle.Success),
                    );

                await client.database.updateGuild(interaction.guild?.id || "", {
                    ...guildDb,
                    premAvatar: value,
                });

                await (modalInteraction as any).update({
                    embeds: [emb],
                    components: [button1, button2, button3],
                    options: {
                        ephemeral: true,
                    },
                });
            })
            .catch((err) => {
                console.log(err);
                captureException(err);
            });
    } catch(e) {
        console.log(e)
    }
  },
};

export default button;
