import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
	name: "selectMenuWelcomeType",
	cooldown: false,
	execute: async (interaction: any, client, guildDb) => {
		const newType = interaction.values[0];
		const dailyMsgs = new EmbedBuilder()
			.setTitle(client.translation.get(guildDb?.language, "Settings.embed.welcomeTitle"))
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
				)}: ${newType}\n${client.translation.get(
					guildDb?.language,
					"Settings.embed.welcomeChannel",
				)}: ${guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : ":x:"}`,
			)
			.setColor("#0598F6")
			.setFooter({
				text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
				iconURL: client?.user?.displayAvatarURL() || undefined,
			});

		const welcomeButtons = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("welcomeType")
				.setEmoji("1185973664538177557")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.dailyType"))
				.setStyle(ButtonStyle.Primary)
				.setEmoji("1185973667973320775"),
			new ButtonBuilder()
				.setCustomId("welcomeChannel")
				.setEmoji("1185973667973320775")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.welcomeChannel"))
				.setStyle(guildDb.welcomeChannel ? ButtonStyle.Primary : ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId("welcomeTest")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.welcomeTest"))
				.setDisabled(!guildDb.welcome)
				.setStyle(guildDb.welcome ? ButtonStyle.Primary : ButtonStyle.Secondary)
				.setEmoji("1207800685928910909"),
		);
		const welcomeButtons2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("welcome")
				.setEmoji("1185973660465500180")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.welcome"))
				.setStyle(guildDb.welcome ? ButtonStyle.Success : ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId("welcomePing")
				.setEmoji("1207801424503644260")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.welcomePing"))
				.setStyle(guildDb.welcomePing ? ButtonStyle.Success : ButtonStyle.Secondary),
		);

		await client.database.updateGuild(interaction.guild.id, {
			...guildDb,
			welcomeType: newType,
		});

		interaction.update({
			content: null,
			embeds: [dailyMsgs],
			components: [welcomeButtons2, welcomeButtons],
			ephemeral: true,
		});
		return;
	},
};

export default button;
