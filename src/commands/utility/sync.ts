import { captureException } from "@sentry/node";
import {
  PermissionFlagsBits,
  type PermissionsBitField,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { stripe } from "../../util/stripeHandler";
import type { ChatInputCommand } from "../../interfaces";
import { GuildModel } from "../../util/Models/guildModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("sync")
    .setDescription("Sync the current servers permium status")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDescriptionLocalizations({
      de: "Synchronisiere den aktuellen Permium-Status des Servers",
      "es-ES": "Sincronizar el estado actual de la prima de los servidores",
      fr: "Synchronise l'état de la prime des serveurs actuels",
      it: "Sincronizza lo stato attuale del permium dei server",
    }),
  // TODO Add discord sub support
  execute: async (interaction, client, guildDb) => {
    if (
      guildDb.customPerm
        ? !(interaction?.member?.roles as Readonly<any>).cache.has(
            guildDb.customPerm,
          )
        : !(
            interaction?.member?.permissions as Readonly<PermissionsBitField>
          ).has(PermissionFlagsBits.ManageGuild)
    ) {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          guildDb.customPerm
            ? client.translation.get(
                guildDb?.language,
                "Language.embed.errorRole",
                { role: `<@&${guildDb.customPerm}>` },
              )
            : client.translation.get(guildDb?.language, "Language.embed.error"),
        );
      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
    }

    const subscription = await stripe.subscriptions.search({
      query: `metadata['serverId']:'${interaction.guildId}'`,
    });

    if (
      !subscription?.data[0]?.current_period_end ||
      subscription?.data[0]?.current_period_end < ~~(Date.now() / 1000)
    ) {
      return interaction.reply({
        content: "You currently don't have any active subscriptions to sync!",
        ephemeral: true,
      });
    }

    await GuildModel.findOneAndUpdate(
      { guildID: interaction.guildId },
      {
        premiumUser: subscription?.data[0]?.metadata.userId,
        premium: 1,
        premiumExpiration: new Date(
          subscription.data[0].current_period_end * 1000,
        ),
      },
    );

    await interaction
      .reply({
        content: "Successfully synced your premium subscription data!",
        ephemeral: true,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
