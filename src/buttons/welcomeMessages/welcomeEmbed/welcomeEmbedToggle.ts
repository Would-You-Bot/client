import { ButtonStyle } from "discord.js";
import type { Button } from "../../../interfaces";
import { welcomeEmbed } from "../../../util/Models/zod/welcomeEmbed";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
  SelectMenu,
} from "../welcomeEmbedEdit";
const button: Button = {
  name: "welcomeEmbedToggle",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const value = guildDb.welcomeEmbed;

    const schema = welcomeEmbed({ guildDb: guildDb });
    if (schema.error && schema?.error?.errors.length! > 0) {
      const errors = schema?.error?.errors;
      interaction.reply({
        content: errors?.map((err) => `${err.path}: ${err.message}`).join("\n"),
        ephemeral: true,
      });
      return;
    }

    const welcome = embed({ client: client, guildDb: guildDb, toggle: !value });
    const welcomeButtons = Button1({ client: client, guildDb: guildDb });
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({
      client: client,
      guildDb: guildDb,
      toggle: !value === true ? ButtonStyle.Success : ButtonStyle.Secondary,
    });
    const welcomeButtons5 = SelectMenu(client, guildDb);

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcomeEmbed: !value,
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
