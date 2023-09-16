const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Sentry = require("@sentry/node");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Debug the would you bot")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Debug den would you bot",
      "es-ES": "Depurar el bot",
      fr: 'Déboguez le bot "Would You"',
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mode")
        .setDescription(
          "Set the bot to debug mode. This allows our developers to use commands without permissions.",
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("webhook")
        .setDescription("Debug if the daily webhook work."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription(
          "Debug the current channel to view some permissons information's.",
        ),
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Debug.permissions"),
        );
      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          Sentry.captureException(err);
        });
    }

    switch (interaction.options.getSubcommand()) {
      case "webhook": {
        if (
          !guildDb?.dailyChannel ||
          !interaction.guild.channels.cache.has(guildDb?.dailyChannel)
        )
          return interaction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Debug.channelNotSet",
            ),
          });

        await client.webhookHandler.sendWebhook(null, guildDb?.dailyChannel, {
          content: client.translation.get(
            guildDb?.language,
            "Debug.testMessage",
          ),
        });

        return interaction.reply({
          ephemeral: true,
          content: client.translation.get(guildDb?.language, "Debug.tryToSent"),
        });
      }
      case "mode": {
        if (guildDb?.debugMode) {
          await client.database.updateGuild(
            interaction.guildId,
            {
              debugMode: false,
            },
            true,
          );

          return interaction.reply({
            ephemeral: true,
            content: client.translation.get(
              guildDb?.language,
              "Debug.disabled",
            ),
          });
        } else {
          await client.database.updateGuild(
            interaction.guildId,
            {
              debugMode: true,
            },
            true,
          );

          return interaction.reply({
            ephemeral: true,
            content: client.translation.get(guildDb?.language, "Debug.enabled"),
          });
        }
      }
      case "channel": {
        const debugEmbed = new EmbedBuilder()
          .setColor("#0598F6")
          .setTimestamp()
          .setTitle(
            client.translation.get(guildDb?.language, "Debug.embed.title"),
          )
          .setDescription(
            `**${client.translation.get(
              guildDb?.language,
              "Debug.embed.settings",
            )}:**\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.isChannel",
                {
                  is:
                    interaction?.channel?.id == guildDb?.dailyChannel
                      ? client.translation.get(
                          guildDb?.language,
                          "Debug.embed.is",
                        )
                      : client.translation.get(
                          guildDb?.language,
                          "Debug.embed.isnot",
                        ),
                },
              )}\n` +
              `**${client.translation.get(
                guildDb?.language,
                "Debug.embed.channel",
              )}:**\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.manageWebhook",
                {
                  can: interaction?.channel
                    ?.permissionsFor(client?.user?.id)
                    .has([PermissionFlagsBits.ManageWebhooks])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.embedLinks",
                {
                  can: interaction?.channel
                    ?.permissionsFor(client?.user?.id)
                    .has([PermissionFlagsBits.EmbedLinks])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.sendMessages",
                {
                  can: interaction?.channel
                    ?.permissionsFor(client?.user?.id)
                    .has([PermissionFlagsBits.SendMessages])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.viewChannel",
                {
                  can: interaction?.channel
                    ?.permissionsFor(client?.user?.id)
                    .has([PermissionFlagsBits.ViewChannel])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.readMessageHistory",
                {
                  can: interaction?.channel
                    ?.permissionsFor(client?.user?.id)
                    .has([PermissionFlagsBits.ReadMessageHistory])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              "\n" +
              `**${client.translation.get(
                guildDb?.language,
                "Debug.embed.global",
              )}:**\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.g_manageWebhooks",
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.ManageWebhooks,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.g_embedLinks",
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.EmbedLinks,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.g_sendMessages",
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.SendMessages,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.g_viewChannel",
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.ViewChannel,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n` +
              `${client.translation.get(
                guildDb?.language,
                "Debug.embed.g_readMessageHistory",
                {
                  can: interaction?.guild?.members?.me?.permissions?.has([
                    PermissionFlagsBits.ReadMessageHistory,
                  ])
                    ? client.translation.get(
                        guildDb?.language,
                        "Debug.embed.can",
                      )
                    : client.translation.get(
                        guildDb?.language,
                        "Debug.embed.cannot",
                      ),
                },
              )}\n`,
          );

        return interaction
          .reply({
            embeds: [debugEmbed],
          })
          .catch((err) => {Sentry.captureException(err);});
      }
    }
  },
};
