import { GuildMember } from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
  name: "welcomeTest",
  execute: async (interaction, client, guildDb) => {
    client.emit("guildMemberAdd", interaction.member as GuildMember);
    interaction.deferUpdate();
    return;
  },
};

export default button;
