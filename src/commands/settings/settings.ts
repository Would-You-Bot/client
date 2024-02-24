import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Change settings for Daily Messages and Welcomes")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Ändere Einstellungen für täglichen Nachrichten und Willkommensnachrichten.",
      "es-ES":
        "Cambiar la configuración de los mensajes diarios y las bienvenidas",
      fr: "Modifier les paramètres des messages quotidiens et des messages de bienvenue",
    })
    .addStringOption((option) =>
      option
        .setName("choose")
        .setDescription("Enable/disable daily Would You messages.")
        .setRequired(true)
        .addChoices(
          { name: "General Settings", value: "general" },
          { name: "Daily Messages", value: "dailyMsgs" },
          { name: "Welcomes", value: "welcomes" },
          { name: "Premium", value: "premium" },
        ),
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    if (
      (interaction.member?.permissions as Readonly<PermissionsBitField>).has(
        PermissionFlagsBits.ManageGuild,
      )
    ) {
      switch (interaction.options.getString("choose")) {
        case "dailyMsgs":
          const dailyMsgs = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyTitle",
              ),
            )
            .setDescription(
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.dailyChannel",
              )}: ${
                guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : ":x:"
              }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  "Settings.embed.dailyRole",
                )}: ${
                  guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : ":x:"
                }\n` +
                `${client.translation.get(
                  guildDb?.language,
                  "Settings.embed.dailyType",
                )}: ${guildDb?.customTypes}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  "Settings.embed.dailyTimezone",
                )}: ${guildDb.dailyTimezone}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  "Settings.embed.dailyInterval",
                )}: ${guildDb.dailyInterval}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  "Settings.embed.dailyThread",
                )}: ${guildDb.dailyThread ? ":white_check_mark:" : ":x:"}\n` +
                `${client.translation.get(
                  guildDb?.language,
                  "Settings.embed.dailyMsg",
                )}: ${guildDb.dailyMsg ? ":white_check_mark:" : ":x:"}`,
            )

            .setColor("#0598F6");
          const dailyButtons =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId("dailyChannel")
                  .setEmoji("1185973667973320775")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyChannel",
                    ),
                  )
                  .setStyle(
                    guildDb.dailyChannel
                      ? ButtonStyle.Primary
                      : ButtonStyle.Secondary,
                  ),
                new ButtonBuilder()
                  .setCustomId("dailyRole")
                  .setEmoji("1185973666811478117")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyRole",
                    ),
                  )
                  .setStyle(
                    guildDb.dailyRole
                      ? ButtonStyle.Primary
                      : ButtonStyle.Secondary,
                  ),
                new ButtonBuilder()
                  .setCustomId("dailyType")
                  .setEmoji("1185973664538177557")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyType",
                    ),
                  )
                  .setStyle(ButtonStyle.Primary),
              ),
            dailyButtons2 =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId("dailyTimezone")
                  .setEmoji("1185973663674150912")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyTimezone",
                    ),
                  )
                  .setStyle(
                    guildDb.dailyTimezone
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
                  ),
                new ButtonBuilder()
                  .setCustomId("dailyInterval")
                  .setEmoji("1185973661736374405")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyInterval",
                    ),
                  )
                  .setStyle(
                    guildDb.dailyInterval
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
                  ),
              ),
            dailyButtons3 =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId("dailyThread")
                  .setEmoji("1185973669059633304")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyThread",
                    ),
                  )
                  .setStyle(
                    guildDb.dailyThread
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
                  ),
                new ButtonBuilder()
                  .setCustomId("dailyMsg")
                  .setEmoji("1185973660465500180")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.dailyMsg",
                    ),
                  )
                  .setStyle(
                    guildDb.dailyMsg
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
                  ),
              );
          interaction
            .reply({
              embeds: [dailyMsgs],
              components: [dailyButtons, dailyButtons2, dailyButtons3],
              ephemeral: true,
            })
            .catch((err) => {
              console.log(err);
            });
          break;

        case "general":
          const generalMsg = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "Settings.embed.generalTitle",
              ),
            )
            .setDescription(
              `${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayType",
              )}: ${guildDb.replayType}\n${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy",
              )}: ${guildDb.replayBy}\n${
                guildDb.replayBy === "Guild"
                  ? client.translation.get(
                      guildDb?.language,
                      "Settings.embed.replayBy2",
                    )
                  : client.translation.get(
                      guildDb?.language,
                      "Settings.embed.replayBy1",
                    )
              }\n${
                guildDb.replayType === "Channels"
                  ? `${client.translation.get(
                      guildDb?.language,
                      "Settings.embed.replayChannels",
                    )}: ${
                      guildDb.replayChannels.length > 0
                        ? `\n${guildDb.replayChannels
                            .map((c) => `<#${c.id}>: ${c.cooldown}`)
                            .join("\n")}`
                        : client.translation.get(
                            guildDb?.language,
                            `Settings.embed.replayChannelsNone`,
                          )
                    }`
                  : `${client.translation.get(
                      guildDb?.language,
                      "Settings.embed.replayCooldown",
                    )}: ${guildDb.replayCooldown}`
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

          const generalButtons =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("replayType")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.replayType",
                  ),
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji("1207774450658050069"),
              new ButtonBuilder()
                .setCustomId("replayBy")
                .setLabel(
                  client.translation.get(
                    guildDb?.language,
                    "Settings.button.replayBy",
                  ),
                )
                .setStyle(ButtonStyle.Primary)
                .setEmoji("1207778786976989244"),
            );

          let setDeleteButtons;
          if (guildDb.replayType === "Channels") {
            setDeleteButtons =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId(
                    guildDb.replayType === "Channels"
                      ? "replayChannels"
                      : "replayCooldown",
                  )
                  .setEmoji("1185973661736374405")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.replayCooldown",
                    ),
                  )
                  .setStyle(
                    guildDb.replayCooldown
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
                  ),
                new ButtonBuilder()
                  .setCustomId("replayDeleteChannels")
                  .setEmoji("1207774452230787182")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.replayDeleteChannels",
                    ),
                  )
                  .setStyle(ButtonStyle.Danger),
              );
          } else {
            setDeleteButtons =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId(
                    guildDb.replayType === "Channels"
                      ? "replayChannels"
                      : "replayCooldown",
                  )
                  .setEmoji("1185973661736374405")
                  .setLabel(
                    client.translation.get(
                      guildDb?.language,
                      "Settings.button.replayCooldown",
                    ),
                  )
                  .setStyle(
                    guildDb.replayCooldown
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
                  ),
              );
          }

          interaction
            .reply({
              embeds: [generalMsg],
              components: [generalButtons, setDeleteButtons],
              ephemeral: true,
            })
            .catch((err) => {
              captureException(err);
            });
          break;

        case "welcomes":
          const welcomes = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "Settings.embed.welcomeTitle",
              ),
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
              )}: ${
                guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : ":x:"
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

          const welcomeButtons =
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
                    guildDb.welcome
                      ? ButtonStyle.Primary
                      : ButtonStyle.Secondary,
                  )
                  .setEmoji("1207800685928910909"),
              ),
            welcomeButtons2 =
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
                    guildDb.welcome
                      ? ButtonStyle.Success
                      : ButtonStyle.Secondary,
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

          interaction.reply({
            embeds: [welcomes],
            components: [welcomeButtons2, welcomeButtons],
            ephemeral: true,
          });
          break;
        case "premium": // @Sans change these to what they really need to be.
          const premium = new EmbedBuilder() // @Sans This is here just as an example for you
            .setTitle(`Premium`) // @Sans if you do add text, make sure to add it to en_EN translation and put in the embeds.
            .setDescription(
              `Webhook Name: ${guildDb.webhookName || ":x:"}\nWebhook Avatar: ${guildDb.webhookURL || ":x:"}`,
            )
            .setColor("#0598F6")
            .setFooter({
              text: client.translation.get(
                guildDb?.language,
                "Settings.embed.footer",
              ),
              iconURL: client?.user?.displayAvatarURL() || undefined,
            });

          const premiumButton =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId("premiumName")
                  .setEmoji("1185973667973320775")
                  .setLabel("Set Name")
                  .setStyle(
                    guildDb.webhookName
                      ? ButtonStyle.Primary
                      : ButtonStyle.Secondary,
                  ),
              ),
            premiumButton2 =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId("premiumURL")
                  .setEmoji("1185973667973320775")
                  .setLabel("Set Avatar")
                  .setStyle(
                    guildDb.webhookURL
                      ? ButtonStyle.Primary
                      : ButtonStyle.Secondary,
                  ),
              );

          const premiumTiers =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel(
                  client.translation.get(guildDb?.language, "Premium.tiers"),
                )
                .setStyle(ButtonStyle.Link)
                .setURL("https://wouldyoubot.gg/premium"),
            );

          interaction.reply({
            embeds: [premium],
            components: (await client.premium.check(interaction.guildId))
              ? [premiumButton, premiumButton2]
              : [premiumTiers],
            ephemeral: true,
          });
          break;
      }
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Settings.embed.error"),
        );
      await interaction
        .reply({
          embeds: [errorEmbed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
    }
  },
};

export default command;
