import {
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
    name: "daySelection",
    cooldown: false,
    execute: async (interaction, client, guildDb) => {
            const inter =
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("selectMenuDays")
                        .setPlaceholder("Click on any of the days.")
                        .setMinValues(0)
                        .setMaxValues(6)
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.monday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(0))
                                .setValue("0"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.tuesday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(1))
                                .setValue("1"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.wednesday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(2))
                                .setValue("2"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.thursday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(3))
                                .setValue("3"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.friday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(4))
                                .setValue("4"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.saturday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(5))
                                .setValue("5"),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(
                                    client.translation.get(
                                        guildDb?.language,
                                        "Settings.select.sunday",
                                    ),
                                )
                                .setDefault(guildDb.excludedDays.includes(6))
                                .setValue("6"),
                        ),
                );

            interaction.update({
                embeds: [],
                content: client.translation.get(
                    guildDb?.language,
                    "Settings.daysSelection",
                ),
                components: [inter],
                options: {
                    ephemeral: true,
                },
            });
  },
};

export default button;