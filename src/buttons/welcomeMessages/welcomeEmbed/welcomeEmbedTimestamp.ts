import { ButtonStyle } from "discord.js";
import type { Button } from "../../../interfaces";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
  SelectMenu,
} from "../welcomeEmbedEdit";
const button: Button = {
  name: "welcomeEmbedTimestamp",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    let value = guildDb.welcomeEmbedTimestamp;
    value = !value;

    const welcome = embed({
      client: client,
      guildDb: guildDb,
      timestamp: value,
    });
    const welcomeButtons = Button1({ client: client, guildDb: guildDb });
    const welcomeButtons2 = Button2({
      client: client,
      guildDb: guildDb,
      timestamp: value ? ButtonStyle.Success : ButtonStyle.Secondary,
    });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = SelectMenu();

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcomeEmbedTimestamp: value,
    });

    interaction.update({
      embeds: [welcome],
      components: [
        welcomeButtons,
        welcomeButtons2,
        welcomeButtons3,
        welcomeButtons4,
        welcomeButtons5,
      ],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
