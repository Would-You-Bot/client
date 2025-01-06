import {
  ActionRowBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import type { Button } from "../../../interfaces";
import { Modal, type ModalData } from "../../../util/modalHandler";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
  Button5,
} from "../welcomeEmbedEdit";
const button: Button = {
  name: "welcomeEmbedTimestamp",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    let value = guildDb.welcomeEmbedTimestamp;
    value = !value

    const welcome = embed({
      client: client,
      guildDb: guildDb,
      timestamp: value,
    });
    const welcomeButtons = Button1({ client: client, guildDb: guildDb });
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb, thumbnail: value ? ButtonStyle.Success : ButtonStyle.Secondary });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = Button5({ client: client, guildDb: guildDb });

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
