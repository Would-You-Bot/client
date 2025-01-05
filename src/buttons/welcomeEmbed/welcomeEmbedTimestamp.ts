import {
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
} from "../welcomeMessages/welcomeEmbedEdit";
const button: Button = {
  name: "welcomeEmbedTimestamp",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    //const value = guildDb.welcomeEmbedTimestamp;

      const welcome = embed({ client: client, guildDb: guildDb, timestamp: 'value' });
      const welcomeButtons = Button1(client, guildDb);
      const welcomeButtons2 = Button2(client, guildDb);
      const welcomeButtons3 = Button3(client, guildDb);
      const welcomeButtons4 = Button4(client, guildDb);
      interaction.update({
        embeds: [welcome],
        components: [
          welcomeButtons,
          welcomeButtons2,
          welcomeButtons3,
          welcomeButtons4,
        ],
        options: {
          ephemeral: true,
        },
      });
  },
};

export default button;
