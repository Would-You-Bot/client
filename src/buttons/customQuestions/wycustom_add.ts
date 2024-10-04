import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, type MessageActionRowComponentBuilder } from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
	name: "wycustom_add",
	cooldown: false,
	execute: async (interaction, client, guildDb) => {
		try {
			const id = interaction.customId.replace("-", ":").split(":")[1];
			const data = client.customAdd.get(id);
			if (!data) {
				interaction.deferUpdate();
				return;
			}

			const typeEmbed = new EmbedBuilder()
				.setTitle(client.translation.get(guildDb?.language, "wyCustom.success.embedAdd.title"))
				.setColor("#0598F4")
				.setDescription(
					`${client.translation.get(guildDb?.language, "wyCustom.success.embedAdd.success", {
						type:
							data?.type === "wouldyourather"
								? client.translation.get(guildDb?.language, "wyCustom.success.embedAdd.descWYR")
								: data?.type === "wwyd"
									? client.translation.get(guildDb?.language, "wyCustom.success.embedAdd.descWWYD")
									: client.translation.get(guildDb?.language, "wyCustom.success.embedAdd.descNHIE"),
					})}\n\n**${client.translation.get(
						guildDb?.language,
						"wyCustom.success.embedAdd.descID",
					)}**: ${id}\n**${client.translation.get(
						guildDb?.language,
						"wyCustom.success.embedAdd.descCat",
					)}**: ${data.type}\n\n**${client.translation.get(
						guildDb?.language,
						"wyCustom.success.embedAdd.descCont",
					)}**: \`${data.text}\``,
				)
				.setFooter({
					text: "Would You",
					iconURL: client?.user?.displayAvatarURL() || undefined,
				});

			const button = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder().setLabel("Add").setStyle(1).setDisabled(true).setCustomId("add"),
			);

			const filtered = guildDb.customMessages.filter((c) => c.id.toString() !== id);
			filtered.push({
				id: id,
				question: data.text,
				type: data.type,
			});

			await client.database.updateGuild(
				interaction.guildId || "",
				{
					...guildDb,
					customMessages: filtered,
				},
				true,
			);

			client.customAdd.delete(id);
			interaction.update({
				embeds: [typeEmbed],
				components: [button],
			});
			return;
		} catch (e) {
			console.log(e);
		}
	},
};

export default button;
