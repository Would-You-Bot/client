import type { ButtonInteraction, Interaction } from "discord.js";
import buttonInteractionEvent from "../buttons";
import commandInteractionEvent from "../commands";
import type { Event } from "../interfaces";
import type WouldYou from "../util/wouldYou";

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
