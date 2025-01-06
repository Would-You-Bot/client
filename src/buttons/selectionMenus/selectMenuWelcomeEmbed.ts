import { ButtonStyle } from "discord.js";
import type { Button } from "../../interfaces";
import {
  embed,
  Button1,
  Button2,
  Button3,
  Button4,
  SelectMenu,
} from "../welcomeMessages/welcomeEmbedEdit";

interface WelcomeEmbedData {
  welcomeEmbedTitle: string;
  welcomeEmbedTitleURL: string;
  welcomeEmbedDescription: string;
  welcomeEmbedAuthorName: string;
  welcomeEmbedAuthorURL: string;
  welcomeEmbedThumbnail: string;
  welcomeEmbedImage: string;
  welcomeEmbedFooterText: string;
  welcomeEmbedFooterURL: string;
  welcomeEmbedColor: string;
  welcomeEmbedContent: string;
}

const valueToPropertyMap: { [key: string]: keyof WelcomeEmbedData } = {
  author: "welcomeEmbedAuthorName",
  authorURL: "welcomeEmbedAuthorURL",
  title: "welcomeEmbedTitle",
  titleURL: "welcomeEmbedTitleURL",
  description: "welcomeEmbedDescription",
  content: "welcomeEmbedContent",
  thumbnail: "welcomeEmbedThumbnail",
  image: "welcomeEmbedImage",
  footer: "welcomeEmbedFooterText",
  footerURL: "welcomeEmbedFooterURL",
  color: "welcomeEmbedColor",
};

const button: Button = {
  name: "selectMenuWelcomeEmbed",
  cooldown: false,
  execute: async (interaction: any, client, guildDb) => {
    try {
      const value = valueToPropertyMap[interaction.values[0]];

      const welcome = embed({
        client: client,
        guildDb: guildDb,
        [interaction.values[0]]: `❌`,
      });

      const welcomeButtons = Button1({
        client: client,
        guildDb: guildDb,
        [interaction.values[0]]: ButtonStyle.Secondary,
      });
      const welcomeButtons2 = Button2({
        client: client,
        guildDb: guildDb,
        [interaction.values[0]]: ButtonStyle.Secondary,
      });
      const welcomeButtons3 = Button3({
        client: client,
        guildDb: guildDb,
        [interaction.values[0]]: ButtonStyle.Secondary,
      });
      const welcomeButtons4 = Button4({
        client: client,
        guildDb: guildDb,
        [interaction.values[0]]: ButtonStyle.Secondary,
      });
      const welcomeButtons5 = SelectMenu();

      await client.database.updateGuild(interaction.guild?.id || "", {
        ...guildDb,
        [value]: null,
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
      });
    } catch (error) {
      console.log(error);
    }
  },
};

export default button;
