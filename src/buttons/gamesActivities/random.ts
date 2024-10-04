import { captureException } from "@sentry/node";
import {
	ActionRowBuilder,
	ButtonBuilder,
	type InteractionReplyOptions,
	type MessageActionRowComponentBuilder,
	PermissionFlagsBits,
} from "discord.js";
import type { Button } from "../../interfaces";

import { DefaultGameEmbed } from "../../util/Defaults/Embeds/Games/DefaultGameEmbed";
import { getRandomTod } from "../../util/Functions/jsonImport";
import { UserModel } from "../../util/Models/userModel";

const button: Button = {
	name: "random",
	cooldown: true,
	execute: async (interaction: any, client, guildDb) => {
		await interaction.deferUpdate();
		await interaction.editReply({
			components: [],
		});
		if (interaction.guild) {
			if (interaction.channel.isThread()) {
				if (!interaction.channel?.permissionsFor(interaction.user.id).has(PermissionFlagsBits.SendMessagesInThreads)) {
					return interaction.followUp({
						content: "You don't have permission to use this button in this channel!",
						ephemeral: true,
					});
				}
			} else if (!interaction.channel?.permissionsFor(interaction.user.id).has(PermissionFlagsBits.SendMessages)) {
				return interaction.followUp({
					content: "You don't have permission to use this button in this channel!",
					ephemeral: true,
				});
			}
		}

		const premium = await client.premium.check(interaction?.guildId);

		const userDb = await UserModel.findOne({
			userID: interaction.user?.id,
		});

		const RANDOM = await getRandomTod(
			guildDb,
			guildDb?.language != null ? guildDb.language : userDb?.language ? userDb.language : "en_EN",
			premium.result,
		);

		const randomEmbed = new DefaultGameEmbed(interaction, RANDOM.id, RANDOM.question, "random");

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		let components = [];

		const randomValue = Math.round(Math.random() * 15);

		if (!premium.result && randomValue < 3) {
			row2.addComponents([
				new ButtonBuilder()
					.setLabel("Invite")
					.setStyle(5)
					.setEmoji("1009964111045607525")
					.setURL(
						"https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
					),
			]);
			components = [row, row2];
		} else if (!premium.result && randomValue >= 3 && randomValue < 5) {
			row2.addComponents([
				new ButtonBuilder()
					.setLabel("Premium")
					.setStyle(5)
					.setEmoji("1256988872160710808")
					.setURL("https://wouldyoubot.gg/premium"),
			]);
			components = [row, row2];
		} else {
			components = [row];
		}
		row.addComponents([
			new ButtonBuilder().setLabel("Truth").setStyle(3).setCustomId("truth"),
			new ButtonBuilder().setLabel("Dare").setStyle(4).setCustomId("dare"),
			new ButtonBuilder().setLabel("Random").setStyle(1).setCustomId("random"),
		]);

		const classicData: InteractionReplyOptions = guildDb?.classicMode
			? { content: RANDOM.question }
			: {
					content:
						!premium.result && randomValue >= 3 && randomValue < 5
							? client.translation.get(guildDb?.language, "Premium.message")
							: undefined,
					embeds: [randomEmbed],
					components: components,
				};

		interaction.followUp(classicData).catch((err: Error) => {
			captureException(err);
		});
	},
};

export default button;
