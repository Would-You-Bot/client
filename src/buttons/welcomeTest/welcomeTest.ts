import { GuildMember } from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "welcomeTest",
  execute: async (interaction, client, guildDb) => {
    client.emit("guildMemberAdd", interaction.member as GuildMember);
  },
};

export default button;
