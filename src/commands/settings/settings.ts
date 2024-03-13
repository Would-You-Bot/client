import { captureException } from "@sentry/node";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits as Permissions,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";
import { IGuildModel } from "../../util/Models/guildModel";
import WouldYou from "../../util/wouldYou";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("settings")
    .setNameLocalizations({
      de: "einstellungen",
      "es-ES": "ajustes",
      fr: "paramètres",
    })
    .setDescription("Change various settings throughout the bot")
    .setDescriptionLocalizations({
      de: "Ändern Sie verschiedene Einstellungen im gesamten Bot",
      "es-ES": "Cambiar varias configuraciones en todo el bot",
      fr: "Modifier divers paramètres dans tout le bot",
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("general")
        .setNameLocalizations({
          de: "allgemein",
          "es-ES": "general",
          fr: "général",
        })
        .setDescription("General Settings")
        .setDescriptionLocalizations({
          de: "Allgemeine Einstellungen",
          "es-ES": "Configuración General",
          fr: "Réglages Généraux",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("daily-messages")
        .setNameLocalizations({
          de: "tägliche-nachrichten",
          "es-ES": "mensajes-diarios",
          fr: "messages-quotidiens",
        })
        .setDescription("Daily Message Settings")
        .setDescriptionLocalizations({
          de: "Tägliche Nachrichteneinstellungen",
          "es-ES": "Configuración de mensajes diarios",
          fr: "Paramètres des messages quotidiens",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("welcome")
        .setNameLocalizations({
          de: "willkommen",
          "es-ES": "bienvenido",
          fr: "bienvenu",
        })
        .setDescription("Welcome Settings")
        .setDescriptionLocalizations({
          de: "Willkommenseinstellungen",
          "es-ES": "Configuración de bienvenida",
          fr: "Paramètres de bienvenue",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("premium")
        .setNameLocalizations({
          de: "premium",
          "es-ES": "prémium",
          fr: "premium",
        })
        .setDescription("Premium Settings")
        .setDescriptionLocalizations({
          de: "Premium-Einstellungen",
          "es-ES": "Configuración prémium",
          fr: "Paramètres premium",
        });

      return cmd;
    }),
  execute: async (interaction, client, guildDb) => {
    const memberHasPermissions = (
      interaction.member?.permissions as Readonly<PermissionsBitField>
    ).has(Permissions.ManageGuild);

    if (!memberHasPermissions) {
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

      return;
    }

    const subCommands = {
      general: {
        fileName: "general",
      },
      "daily-messages": {
        fileName: "dailyMsgs",
      },
      welcome: {
        fileName: "welcomes",
      },
      premium: {
        fileName: "premium",
      },
    };

    const subCommand =
      interaction.options.getSubcommand() as keyof typeof subCommands;

    type SubCommandFunction = (
      interaction: ChatInputCommandInteraction,
      client: WouldYou,
      guildDb: IGuildModel,
    ) => Promise<void>;

    const cmd: SubCommandFunction = (
      await import(
        `./settings-subcommands/${subCommands[subCommand].fileName}.js`
      )
    ).default;

    await cmd(interaction, client, guildDb);
  },
};

export default command;
