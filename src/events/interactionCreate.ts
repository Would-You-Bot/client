import { ButtonInteraction, Interaction } from "discord.js";
import { Event } from "../interfaces";
import WouldYou from "../util/wouldYou";
import commandInteractionEvent from "../commands";
import buttonInteractionEvent from "../buttons";

const event: Event = {
  event: "interactionCreate",
  execute: async (
    client: WouldYou,
    interaction: Interaction | ButtonInteraction,
  ) => {
    if (interaction.isCommand()) {
      await commandInteractionEvent.execute(client, interaction);
    } else if (interaction.isButton() || interaction.isAnySelectMenu()) {
      await buttonInteractionEvent.execute(client, interaction);
    }
  },
};

export default event;
