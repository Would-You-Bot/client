import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";

const button: Button = {
	name: "webhookName",
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
			title: "Custom Username",
			customId: "webhookNameModal",
			fields: [
				{
					customId: "input",
					style: "line",
					label: "Provide a username for QOTD webhooks",
					required: true,
					placeholder: "This username will be used for QOTD webhooks",
				},
			],
		} as ModalData).getData(interaction);

		const value = data?.fieldValues[0].value;

		const filter = ["Discord", "discord", "Everyone", "everyone", "clyde", "Clyde"];
		for (let i = 0; filter.length > i; i++) {
			if (value?.includes(filter[i])) {
				data?.modal.reply({
					content: client.translation.get(guildDb?.language, "Settings.filter"),
					ephemeral: true,
				});
				return;
			}
		}

		const emb = new EmbedBuilder()
			.setTitle("Would You - Utility")
			.setDescription(
				`${client.translation.get(guildDb?.language, "Settings.embed.username")}: ${value}\n${client.translation.get(
					guildDb?.language,
					"Settings.embed.avatar",
				)}: ${guildDb.webhookAvatar ? `[Image](<${guildDb.webhookAvatar}>)` : ":x:"}\n${client.translation.get(
					guildDb?.language,
					"Settings.embed.classicMode",
				)}: ${guildDb.classicMode ? ":white_check_mark:" : ":x:"}`,
			)
			.setColor("#0598F6")
			.setFooter({
				text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
				iconURL: client?.user?.displayAvatarURL() || undefined,
			});

		const button = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("webhookName")
				.setEmoji("1185973660465500180")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.name"))
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("webhookAvatar")
				.setEmoji("1207801424503644260")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.avatar"))
				.setStyle(guildDb.webhookAvatar ? ButtonStyle.Success : ButtonStyle.Secondary),
		);

		const button2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("classicMode")
				.setEmoji("1256977616242606091")
				.setLabel(client.translation.get(guildDb?.language, "Settings.button.classicMode"))
				.setStyle(guildDb.classicMode ? ButtonStyle.Success : ButtonStyle.Secondary),
		);

		await client.database.updateGuild(interaction.guild?.id || "", {
			...guildDb,
			webhookName: value,
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
