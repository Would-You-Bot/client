import { ButtonStyle } from "discord.js";
import type { Button } from "../../../interfaces";
import { Modal, type ModalData } from "../../../util/modalHandler";
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
  name: "welcomeEmbedAuthorURL",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const { data } = await new Modal({
      title: "Set Author URL",
      customId: "WelcomeEmbedEdit",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "What should the author URL be?",
          required: true,
          placeholder: "Welcome to the server!",
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;

    const schema = welcomeEmbed({ guildDb: guildDb, authorURL: value });

    if (
      guildDb.welcomeEmbed &&
      schema.error &&
      schema?.error?.errors.length! > 0
    ) {
      const errors = schema?.error?.errors;
      await (data?.modal as any).reply({
        content: errors?.map((err) => `${err.path}: ${err.message}`).join("\n"),
        ephemeral: true,
      });
      return;
    }

    const welcome = embed({
      client: client,
      guildDb: guildDb,
      authorURL: value,
    });
    const welcomeButtons = Button1({
      client: client,
      guildDb: guildDb,
      authorURL: ButtonStyle.Success,
    });
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = SelectMenu();

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcomeEmbedAuthorURL: value,
    });

    await (data?.modal as any).update({
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
