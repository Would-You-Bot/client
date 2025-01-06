import {
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import type { Button } from "../../../interfaces";
import { Modal, type ModalData } from "../../../util/modalHandler";
import { welcomeEmbed } from "../../../util/Models/zod/welcomeEmbed";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
  Button5,
} from "../welcomeEmbedEdit";
const button: Button = {
  name: "welcomeEmbedFooterText",
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

    const schema = welcomeEmbed({ guildDb: guildDb, footer: value });

    if (
      guildDb.welcomeEmbed &&
      schema.error &&
      schema?.error?.errors.length! > 0
    ) {
      const errors = schema?.error?.errors;
      interaction.reply({
        content: errors?.map((err) => `${err.path}: ${err.message}`).join("\n"),
        ephemeral: true,
      });
      return;
    }

    const welcome = embed({
      client: client,
      guildDb: guildDb,
      footerText: value,
    });

    const welcomeButtons = Button1({ client: client, guildDb: guildDb });
    const welcomeButtons2 = Button2({ client: client, guildDb: guildDb });
    const welcomeButtons3 = Button3({ client: client, guildDb: guildDb });
    const welcomeButtons4 = Button4({ client: client, guildDb: guildDb });
    const welcomeButtons5 = Button5({ client: client, guildDb: guildDb });

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcomeEmbedFooter: value,
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
