import { captureException } from "@sentry/node";
import { EmbedBuilder, PermissionFlagsBits, type PermissionsBitField, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommand } from "../../interfaces";
import { UserModel } from "../../util/Models/userModel";

const command: ChatInputCommand = {
	requireGuild: true,
	data: new SlashCommandBuilder()
		.setName("language")
		.setDescription("Changes the language for your server")
		.setContexts([0, 1, 2])
		.setIntegrationTypes([0, 1])
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDescriptionLocalizations({
			de: "Ändere die Sprache für den aktuellen Server",
			"es-ES": "Cambiar el idioma del bot en el servidor",
			fr: "Changer la langue du serveur actuel",
			it: "Cambia la lingua per il server attuale",
		})
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("What you want to change the language for.")
				.setRequired(true)
				.addChoices({ name: "User", value: "user" }, { name: "Server", value: "server" }),
		)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription("The language you want to use.")
				.setRequired(true)
				.addChoices(
					{ name: "🇩🇪 Deutsch", value: "de_DE" },
					{ name: "🇺🇸 English", value: "en_EN" },
					{ name: "🇪🇸 Español", value: "es_ES" },
					{ name: "🇫🇷 Français", value: "fr_FR" },
					{ name: "🇮🇹 Italiano", value: "it_IT" },
				),
		),

	execute: async (interaction, client, guildDb) => {
		let languageembed: EmbedBuilder;

		const languageMap = {
			de_DE: {
				title: "Sprache geändert!",
				description: "Deutsch wurde als neue Sprache ausgewählt!",
			},
			en_EN: {
				title: "Language changed!",
				description: "English has been selected as the new language!",
			},
			es_ES: {
				title: "¡Idioma cambiado!",
				description: "¡Has seleccionado el español como nuevo idioma!",
			},
			fr_FR: {
				title: "Langue changée!",
				description: "Français a été sélectionné comme nouvelle langue!",
			},
			it_IT: {
				title: "Lingua cambiata!",
				description: "Italiano è stato selezionato come nuova lingua!",
			},
		} as Record<string, { title: string; description: string }>;

		languageembed = new EmbedBuilder()
			.setTitle(languageMap[interaction.options.getString("language") || "en_EN"].title)
			.setDescription(languageMap[interaction.options.getString("language") || "en_EN"].description)
			.setFooter({
				text: "Would You",
				iconURL: client?.user?.displayAvatarURL() || undefined,
			})
			.setColor("#0598F6");

		switch (interaction.options.getString("type")) {
			case "user": {
				if (interaction.guild) {
					interaction.reply({
						content: "You can only change the language for your user in direct messages!",
						ephemeral: true,
					});
					return;
				}
				await UserModel.findOneAndUpdate(
					{ userID: interaction.user.id },
					{ language: interaction.options.getString("language") || "en_EN" },
					{ upsert: true },
				);

				interaction
					.reply({
						embeds: [languageembed as EmbedBuilder],
						ephemeral: true,
					})
					.catch((err) => {
						captureException(err);
					});
				break;
			}
			case "server": {
				if (!interaction.guild && !interaction.guildId) {
					interaction.reply({
						content: "You can only change the language for the server in a server!",
						ephemeral: true,
					});
					return;
				}
				if ((interaction.memberPermissions as Readonly<PermissionsBitField>).has(PermissionFlagsBits.ManageGuild)) {
					await client.database.updateGuild(
						interaction.guildId as string,
						{
							...guildDb,
							language: interaction.options.getString("language") || "en_EN",
						},
						true,
					);

					interaction
						.reply({
							embeds: [languageembed as EmbedBuilder],
							ephemeral: true,
						})
						.catch((err) => {
							captureException(err);
						});
					break;
				}
				const errorembed = new EmbedBuilder()
					.setColor("#F00505")
					.setTitle("Error!")
					.setDescription(client.translation.get(guildDb?.language, "Language.embed.error"));
				interaction
					.reply({
						embeds: [errorembed],
						ephemeral: true,
					})
					.catch((err) => {
						captureException(err);
					});
				return;
			}
		}
	},
};

export default command;
