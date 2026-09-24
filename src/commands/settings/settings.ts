import { captureException } from "@sentry/node";
import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  type PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import type { ChatInputCommand } from "../../interfaces";
import type { IGuildModel } from "../../util/Models/guildModel";
import type WouldYou from "../../util/wouldYou";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("settings")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDescription("Change various settings throughout the bot")
    .setDescriptionLocalizations({
      de: "Ändere Einstellungen für täglichen Nachrichten und Willkommensnachrichten.",
      "es-ES":
        "Cambiar la configuración de los mensajes diarios y las bienvenidas",
      fr: "Modifier les paramètres des messages quotidiens et des messages de bienvenue",
      it: "Cambia le impostazioni dei messaggi giornalieri e di benvenuto",
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("cooldowns")
        .setDescription("Change settings regarding cooldowns")
        .setDescriptionLocalizations({
          de: "Ändere Einstellungen bezüglich des Cooldowns",
          "es-ES": "Cambiar la configuración del tiempo de espera",
          fr: "Modifier les paramètres de temps d'attente",
          it: "Cambia le impostazioni relative al tempo di attesa",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("qotd")
        .setDescription("Change settings regarding the QOTD system")
        .setDescriptionLocalizations({
          de: "Ändere Einstellungen bezüglich des QOTD-Systems",
          "es-ES": "Cambiar la configuración del sistema de Pregunta del día",
          fr: "Modifier les paramètres du système QOTD",
          it: "Cambia le impostazioni relative al sistema QOTD",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("welcome")
        .setDescription("Change settings regarding welcome messages")
        .setDescriptionLocalizations({
          de: "Ändere Einstellungen bezüglich der Willkommensnachrichten",
          "es-ES": "Cambiar la configuración de los mensajes de bienvenida",
          fr: "Modifier les paramètres des messages de bienvenue",
          it: "Cambia le impostazioni dei messaggi di benvenuto",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("utility")
        .setDescription("Change useful utility settings")
        .setDescriptionLocalizations({
          de: "Ändere nützliche Einstellungen",
          "es-ES": "Cambiar la configuración de utilidad útil",
          fr: "Modifier les paramètres d'utilité utile",
          it: "Cambia le impostazioni utility utili",
        });

      return cmd;
    })
    .addSubcommand((cmd) => {
      cmd
        .setName("question-types")
        .setDescription("Change settings regarding question types")
        .setDescriptionLocalizations({
          de: "Ändere Einstellungen bezüglich der Fragetypen",
          "es-ES": "Cambiar la configuración de los tipos de preguntas",
          fr: "Modifier les paramètres des types de questions",
          it: "Cambia le impostazioni relative ai tipi di domande",
        });

      return cmd;
    }),
  execute: async (interaction, client, guildDb) => {
    const perms = interaction.member
      ?.permissions as Readonly<PermissionsBitField>;
    const hasManage = perms.has(PermissionFlagsBits.ManageGuild);
    const hasCustom =
      guildDb.customPerm &&
      (interaction?.member?.roles as Readonly<any>).cache.has(
        guildDb.customPerm,
      );

    if (guildDb.customPerm ? !(hasManage || hasCustom) : !hasManage) {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          guildDb.customPerm
            ? client.translation.get(
                guildDb?.language,
                "Language.embed.errorRole",
                {
                  role: `<@&${guildDb.customPerm}>`,
                },
              )
            : client.translation.get(guildDb?.language, "Language.embed.error"),
        );

      return interaction
        .reply({ embeds: [errorembed], ephemeral: true })
        .catch((err) => captureException(err));
    }

    const subCommands = {
      cooldowns: {
        fileName: "cooldowns",
      },
      qotd: {
        fileName: "qotd",
      },
      welcome: {
        fileName: "welcomes",
      },
      utility: {
        fileName: "utility",
      },
      "question-types": {
        fileName: "questionType",
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
