import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of all the 'Would You' commands")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Zeigt eine Liste aller Befehle an",
      "es-ES": "Muestra una lista de cada comando",
      fr: "Affiche une liste de toutes les commandes",
      it: "Mostra un elenco di tutti i comandi",
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const languageMappings = {
      de_DE: "de",
      en_EN: "en",
      es_ES: "es",
      fr_FR: "fr",
      it_IT: "it",
    } as any;

    const commands = await client.application?.commands.fetch({
      withLocalizations: true,
    });
    console.log(commands)
    const type = languageMappings[guildDb?.language] || "en";
    const helpembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Help.embed.footer"),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, "Help.embed.title"))
      .addFields({
        name: client.translation.get(
          guildDb?.language,
          "Help.embed.Fields.privacyname",
        ),
        value: client.translation.get(
          guildDb?.language,
          "Help.embed.Fields.privacy",
        ),
        inline: false,
      })
      .setDescription(
        client.translation.get(guildDb?.language, "Help.embed.description") +
          `\n\n${(commands as any)
            .filter((e: any) => e.name !== "reload")
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((n: any) => {
              const descriptionMap: { [key: string]: string | undefined } = {
                de: n.descriptionLocalizations.de,
                es: n.descriptionLocalizations["es-ES"],
                fr: n.descriptionLocalizations.fr,
                it: n.descriptionLocalizations.it,
              };
            
              const description = descriptionMap[type] || n.description;
            
              return `</${n.name}:${n.id}> - ${description}`;
            })
            
            .join("\n")}`,
      );

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(
            client.translation.get(guildDb?.language, "Help.button.title"),
          )
          .setStyle(5)
          .setEmoji("💫")
          .setURL("https://discord.gg/vMyXAxEznS"),
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("1009964111045607525")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
      );
    await interaction
      .reply({
        embeds: [helpembed],
        components: [button],
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
