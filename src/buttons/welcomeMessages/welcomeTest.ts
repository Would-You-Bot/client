import type { GuildMember } from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
	name: "welcomeTest",
	cooldown: false,
	execute: async (interaction, client, guildDb) => {
		client.emit("guildMemberAdd", interaction.member as GuildMember);
		interaction.deferUpdate();
		return;
	},
};

export default button;
