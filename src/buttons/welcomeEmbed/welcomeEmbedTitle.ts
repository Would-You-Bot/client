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
  name: "welcomeEmbedTitle",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const { data } = await new Modal({
      title: "Set Embed Title",
      customId: "WelcomeEmbedEdit",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "What should the embed title be?",
          required: true,
          placeholder: "Welcome to the server!",
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;
    const welcome = embed({ client: client, guildDb: guildDb, title: value });
    const welcomeButtons = Button1(client, guildDb);
    const welcomeButtons2 = Button2(client, guildDb);
    const welcomeButtons3 = Button3(client, guildDb);
    const welcomeButtons4 = Button4(client, guildDb);
    await (data?.modal as any).update({
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
