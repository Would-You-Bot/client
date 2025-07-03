import { captureException } from "@sentry/node";
import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  PermissionFlagsBits,
  type PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import type { ChatInputCommand } from "../../interfaces";
import {
  generateNHIE,
  generateWWYD,
  generateWYR,
} from "../../util/generateText";
import Paginator from "../../util/pagination";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("custom")
    .setDescription("Lets you manage your own questions")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      de: "Fügt eigene WouldYou Fragen hinzu",
      "es-ES": "Añade mensajes Would You personalizados",
      fr: "Ajoute des messages personnalisés au bot",
      it: "Aggiungi messaggi personalizzati a Would You",
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a custom message")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription(
              "Select which category you want this custom message to be in."
            )
            .setRequired(true)
            .addChoices(
              { name: "Would You Rather", value: "wouldyourather" },
              { name: "Never Have I Ever", value: "neverhaveiever" },
              { name: "What Would You Do", value: "wwyd" },
              { name: "Truth", value: "truth" },
              { name: "Dare", value: "dare" },
              { name: "Topic", value: "topic" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription(
              "Input a message to create a custom WouldYou message."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a custom message.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Input a custom WouldYou ID number to remove it.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("removeall")
        .setDescription("Removes all custom messages.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("Views all of your custom WouldYou messages")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("import")
        .setDescription("Imports custom messages from a JSON file.")
        .addAttachmentOption((option) =>
          option
            .setName("attachment")
            .setDescription(
              "Import a JSON file containing useless or useful Would You custom messages."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("export")
        .setDescription("Exports custom messages into a JSON file.")
    ),

  execute: async (interaction, client, guildDb) => {
    let typeEmbed = new EmbedBuilder();
    let message: string | null;
    let generativeText: any;

    if (
      (interaction?.member?.permissions as Readonly<PermissionsBitField>).has(
        PermissionFlagsBits.ManageGuild
      )
    ) {
      switch (interaction.options.getSubcommand()) {
        case "add": {
          const option =
            interaction?.options?.getString("options")?.toLowerCase() || "";
          const premium = await client.premium.check(interaction.guildId);
          message = interaction.options.getString("message");

          if (
            !premium.result &&
            guildDb.customMessages.filter((e) => e.type === option).length + 1 >
              100
          ) {
            const premiumButton =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                new ButtonBuilder()
                  .setLabel("Premium")
                  .setStyle(ButtonStyle.Link)
                  .setURL("https://wouldyoubot.gg/premium")
              );
            interaction.reply({
              content: `:x: ${client.translation.get(
                guildDb?.language,
                "wyCustom.error.limit",
                {
                  type: `\`${option}\``,
                }
              )}`,
              components: [premiumButton],
              ephemeral: true,
            });
            return;
          }

          const newID = uuidv4();
          if (option === "wouldyourather")
            generativeText = generateWYR(client, message || "", newID, guildDb);
          else if (option === "neverhaveiever")
            generativeText = generateNHIE(
              client,
              message || "",
              newID,
              guildDb
            );
          else if (option === "wwyd")
            generativeText = generateWWYD(
              client,
              message || "",
              newID,
              guildDb
            );
          else generativeText = { value: true, type: option };
          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.title"
              )
            )
            .setColor("#0598F4")
            .setDescription(
              `${
                generativeText.value
                  ? ""
                  : `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.embedAdd.descAccept",
                      {
                        type:
                          generativeText?.type === "wouldyourather"
                            ? client.translation.get(
                                guildDb?.language,
                                "wyCustom.success.embedAdd.descWYR"
                              )
                            : generativeText?.type === "wwyd"
                              ? client.translation.get(
                                  guildDb?.language,
                                  "wyCustom.success.embedAdd.descWWYD"
                                )
                              : client.translation.get(
                                  guildDb?.language,
                                  "wyCustom.success.embedAdd.descNHIE"
                                ),
                      }
                    )}\n\n`
              }**${client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.descID"
              )}**: ${newID}\n**${client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.descCat"
              )}**: ${option}\n\n**${client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedAdd.descCont"
              )}**: \`${message}\``
            )
            .setFooter({
              text: `Would You ${
                generativeText.value
                  ? ""
                  : `| ${client.translation.get(guildDb?.language, "wyCustom.success.embedAdd.footerDisable")}`
              }`,
              iconURL: client?.user?.displayAvatarURL() || undefined,
            });

          guildDb.customMessages.push({
            id: newID,
            question: message || "",
            type: option,
          });

          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customMessages: guildDb.customMessages,
            },
            true
          );

          const add =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("Add")
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`wycustom_add-${newID}`),
              new ButtonBuilder()
                .setLabel("Don't Add")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`wycustom_remove-${newID}`)
            );

          const addDisable =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("Add")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
                .setCustomId("wycustom_add"),
              new ButtonBuilder()
                .setLabel("Don't Add")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("wycustom_remove")
            );

          interaction
            .reply(
              generativeText.value
                ? {
                    embeds: [typeEmbed],
                    ephemeral: true,
                  }
                : {
                    embeds: [typeEmbed],
                    components: [add],
                    ephemeral: true,
                  }
            )
            .then((msg) =>
              setTimeout(() => {
                if (!generativeText.value && client.customAdd.has(newID)) {
                  msg.edit({ components: [addDisable] });
                  client.customAdd.delete(newID);
                }
              }, 30 * 1000)
            )
            .catch((err) => {
              console.log(err);
              captureException(err);
            });
          return;
        }
        case "remove": {
          message = interaction.options.getString("message");
          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedRemove.title"
              )
            )
            .setColor("#0598F4")
            .setFooter({
              text: "Would You",
              iconURL: client?.user?.displayAvatarURL() || undefined,
            });
          if (!guildDb.customMessages.find((c) => c.id === message)) {
            interaction.reply({
              content: `Custom message with ID: ${message} doesn't exist.`,
              ephemeral: true,
            });
            return;
          }
          interaction.reply({
            content: `Sucessfully deleted question with id: ${message}`,
            ephemeral: true,
          });
          const filtered = guildDb.customMessages.filter(
            (c) => c.id !== message
          );

          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customMessages: filtered,
            },
            true
          );
          break;
        }
        case "removeall": {
          if (guildDb.customMessages.length === 0) {
            interaction.reply({
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedRemoveAll.none"
              ),
              ephemeral: true,
            });
            return;
          }

          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(
                guildDb?.language,
                "wyCustom.success.embedRemoveAll.title"
              )
            )
            .setColor("#0598F4")
            .setFooter({
              text: "Would You",
              iconURL: client?.user?.displayAvatarURL() || undefined,
            });

          const button =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("Accept")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("wycustom_accept"),
              new ButtonBuilder()
                .setLabel("Decline")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("wycustom_decline")
            );

          interaction.reply({
            embeds: [typeEmbed],
            components: [button],
            ephemeral: true,
          });
          return;
        }
        case "view": {
          if (guildDb.customMessages.length === 0) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.empty"
              ),
            });
            return;
          }

          const paginate = client.paginate.get(`${interaction.user.id}-custom`);
          if (paginate) {
            clearTimeout(paginate.timeout);
            client.paginate.delete(`${interaction.user.id}-custom`);
          }

          const page = new Paginator({
            user: interaction.user.id,
            timeout: 180000,
            client,
          });

          if (
            guildDb.customMessages.filter((c) => c.type === "neverhaveiever")
              .length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "neverhaveiever")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID"
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg"
                  )}: ${s.question}`
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title"
                    )
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatNHIE"
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`
                  )
                  .setColor("#0795F6")
              )
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "wouldyourather")
              .length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "wouldyourather")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID"
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg"
                  )}: ${s.question}`
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title"
                    )
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatWYR"
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`
                  )
                  .setColor("#0795F6")
              )
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "truth").length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "truth")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID"
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg"
                  )}: ${s.question}`
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title"
                    )
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatTRUTH"
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`
                  )
                  .setColor("#0795F6")
              )
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "dare").length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "dare")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID"
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg"
                  )}: ${s.question}`
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title"
                    )
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatDARE"
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`
                  )
                  .setColor("#0795F6")
              )
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "wwyd").length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "wwyd")
              .map(
                (s, i) =>
                  `${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descID"
                  )}: ${s.id}\n${client.translation.get(
                    guildDb?.language,
                    "wyCustom.success.embedAdd.descMsg"
                  )}: ${s.question}`
              );
            data = Array.from(
              {
                length: Math.ceil(data.length / 5),
              },
              (a, r) => data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title"
                    )
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatWWYD"
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`
                  )
                  .setColor("#0795F6")
              )
            );
          }

          if (
            guildDb.customMessages.filter((c) => c.type === "topic").length > 0
          ) {
            let data: any;
            data = guildDb.customMessages
              .filter((c) => c.type === "topic")
              .map((s, i) => `${s.id}: ${s.question}`);
            data = Array.from({ length: Math.ceil(data.length / 5) }, (a, r) =>
              data.slice(r * 5, r * 5 + 5)
            );

            Math.ceil(data.length / 5);
            data = data.map((e: any) =>
              page.add(
                new EmbedBuilder()
                  .setTitle(
                    client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.title"
                    )
                  )
                  .setDescription(
                    `${client.translation.get(
                      guildDb?.language,
                      "wyCustom.success.paginator.descCatTOPIC"
                    )}\n\n${e.slice(0, 5).join("\n\n").toString()}`
                  )
                  .setColor("#0795F6")
              )
            );
          }

          page.start(interaction, "custom");
          return;
        }
        case "import": {
          const attachment = interaction.options.get("attachment");

          if (!attachment) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.import.att1"
              ),
            });
            return;
          }

          if (!attachment.attachment?.name.includes(".json")) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.import.att2"
              ),
            });
            return;
          }

          // Let give the bot some more time to fetch it :)
          await interaction.deferReply({ ephemeral: true });

          axios
            .get(attachment.attachment.url, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(async (response) => {
              if (response.data.length === 0) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att3"
                  ),
                });
                return;
              }

              if (
                !response.data.wouldyourather &&
                !response.data.neverhaveiever &&
                !response.data.truth &&
                !response.data.dare &&
                !response.data.wwyd &&
                !response.data.topic
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att4"
                  ),
                });
                return;
              }

              if (
                response.data.wouldyourather?.length === 0 ||
                response.data.neverhaveiever?.length === 0 ||
                response.data.truth?.length === 0 ||
                response.data.dare?.length === 0 ||
                response.data.wwyd?.length === 0 ||
                response.data.topic?.length === 0
              ) {
                interaction.editReply({
                  options: {
                    ephemeral: true,
                  },
                  content: client.translation.get(
                    guildDb?.language,
                    "wyCustom.error.import.att4"
                  ),
                });
                return;
              }

              let prem = [];
              if (!(await client.premium.check(interaction.guildId)).result) {
                prem.push(true);
              }

              const all = [];
              for (const key in response.data) {
                if (!response.data.hasOwnProperty(key)) continue;
                if (
                  prem.length > 0 &&
                  guildDb.customMessages.filter((e) => e.type === key).length +
                    response.data[key].length >
                    100
                ) {
                  for (const key in response.data) {
                    if (!response.data.hasOwnProperty(key)) continue;
                    if (
                      guildDb.customMessages.filter((e) => e.type === key)
                        .length +
                        response.data[key].length >
                      100
                    )
                      all.push(key);
                  }

                  const premiumButton =
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                      new ButtonBuilder()
                        .setLabel("Premium")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://wouldyoubot.gg/premium")
                    );

                  interaction.editReply({
                    content: `:x: ${client.translation.get(
                      guildDb?.language,
                      "wyCustom.error.limit",
                      {
                        type: all.map((e) => `\`${e}\``).join(", "),
                      }
                    )}\n\n${client.translation.get(guildDb?.language, "wyCustom.error.addToLimit")}`,
                    components: [premiumButton],
                  });
                }
              }

              for (const key in response.data) {
                if (!response.data.hasOwnProperty(key)) continue;
                // check if d["question"] has content in it or even exists
                for (const d of response.data[key]) {
                  if (!d.question || d.question === "") {
                    return interaction.editReply({
                      content: client.translation.get(
                        guildDb?.language,
                        "wyCustom.error.import.att4"
                      ),
                      components: [],
                    });
                  }
                }
              }

              if (response.data.wouldyourather) {
                let i = guildDb.customMessages.filter(
                  (e) => e.type === "wouldyourather"
                ).length;
                response.data.wouldyourather.map((d: any) => {
                  if (prem.length > 0 && i === 100) return;
                  i++;
                  const newID = uuidv4();
                  guildDb.customMessages.push({
                    id: d.id ? d.id : newID,
                    question: d.question,
                    type: "wouldyourather",
                  });
                });
              }

              if (response.data.truth) {
                let i = guildDb.customMessages.filter(
                  (e) => e.type === "truth"
                ).length;
                response.data.truth.map((d: any) => {
                  if (prem.length > 0 && i === 100) return;
                  i++;
                  const newID = uuidv4();
                  guildDb.customMessages.push({
                    id: d.id ? d.id : newID,
                    question: d.question,
                    type: "truth",
                  });
                });
              }

              if (response.data.dare) {
                let i = guildDb.customMessages.filter(
                  (e) => e.type === "dare"
                ).length;
                response.data.dare.map((d: any) => {
                  if (prem.length > 0 && i === 100) return;
                  i++;
                  const newID = uuidv4();
                  guildDb.customMessages.push({
                    id: d.id ? d.id : newID,
                    question: d.question,
                    type: "dare",
                  });
                });
              }

              if (response.data.neverhaveiever) {
                let i = guildDb.customMessages.filter(
                  (e) => e.type === "neverhaveiever"
                ).length;
                response.data.neverhaveiever.map((d: any) => {
                  if (prem.length > 0 && i === 100) return;
                  i++;

                  const newID = uuidv4();
                  guildDb.customMessages.push({
                    id: d.id ? d.id : newID,
                    question: d.question,
                    type: "neverhaveiever",
                  });
                });
              }

              if (response.data.wwyd) {
                let i = guildDb.customMessages.filter(
                  (e) => e.type === "wwyd"
                ).length;
                response.data.wwyd.map((d: any) => {
                  if (prem.length > 0 && i === 100) return;
                  i++;

                  const newID = uuidv4();
                  guildDb.customMessages.push({
                    id: d.id ? d.id : newID,
                    question: d.question,
                    type: "wwyd",
                  });
                });
              }

              await client.database.updateGuild(
                interaction.guildId || "",
                {
                  ...guildDb,
                  customMessages: guildDb.customMessages,
                },
                true
              );

              if (all.length > 0) return;
              interaction.editReply({
                options: {
                  ephemeral: true,
                },
                content: client.translation.get(
                  guildDb?.language,
                  "wyCustom.success.import"
                ),
              });
              return;
            })
            .catch((err) => {
              captureException(err);
              interaction.editReply(
                `${client.translation.get(guildDb?.language, "wyCustom.error.import.att15")}\n\nError: ${err}`
              );
              return;
            });
          break;
        }
        case "export": {
          if (guildDb.customMessages.length === 0) {
            interaction.reply({
              ephemeral: true,
              content: client.translation.get(
                guildDb?.language,
                "wyCustom.error.export.none"
              ),
            });
            return;
          }

          await interaction.deferReply();

          const wouldyourather = guildDb.customMessages.filter(
            (c) => c.type === "wouldyourather"
          );
          const truth = guildDb.customMessages.filter(
            (c) => c.type === "truth"
          );
          const dare = guildDb.customMessages.filter((c) => c.type === "dare");
          const neverhaveiever = guildDb.customMessages.filter(
            (c) => c.type === "neverhaveiever"
          );
          const wwyd = guildDb.customMessages.filter((c) => c.type === "wwyd");
          const topic = guildDb.customMessages.filter(
            (c) => c.type === "topic"
          );

          let text = "{\n";
          const arrays = [];

          if (wouldyourather.length > 0) {
            let arrayText = `"wouldyourather": [`;
            arrayText += wouldyourather
              .map((a, index) => {
                const i = index + 1;
                return `\n{ "question": "${a.question}", "id": "${a.id}" }${wouldyourather.length !== i ? "," : ""}`;
              })
              .join("");
            arrayText += "\n]";
            arrays.push(arrayText);
          }
          if (truth.length > 0) {
            let arrayText = `"truth": [`;
            truth.map((a, index) => {
              const i = index + 1;
              arrayText += `\n{ "question": "${a.question}", "id": "${a.id}" }${truth.length !== i ? "," : ""}`;
            });
            arrayText += "\n]";
            arrays.push(arrayText);
          }

          if (dare.length > 0) {
            let arrayText = `"dare": [`;
            dare.map((a, index) => {
              const i = index + 1;
              arrayText += `\n{ "question": "${a.question}", "id": "${a.id}" }${dare.length !== i ? "," : ""}`;
            });
            arrayText += "\n]";
            arrays.push(arrayText);
          }

          if (neverhaveiever.length > 0) {
            let arrayText = `"neverhaveiever": [`;
            neverhaveiever.map((a, index) => {
              const i = index + 1;
              arrayText += `\n{ "question": "${a.question}", "id": "${a.id}" }${neverhaveiever.length !== i ? "," : ""}`;
            });
            arrayText += "\n]";
            arrays.push(arrayText);
          }

          if (wwyd.length > 0) {
            let arrayText = `"wwyd": [`;
            wwyd.map((a, index) => {
              const i = index + 1;
              arrayText += `\n{ "question": "${a.question}", "id": "${a.id}" }${wwyd.length !== i ? "," : ""}`;
            });
            arrayText += "\n]";
            arrays.push(arrayText);
          }

          if (topic.length > 0) {
            let arrayText = `"topic": [`;
            topic.map((a, index) => {
              const i = index + 1;
              arrayText += `\n{ "question": "${a.question}", "id": "${a.id}" }${topic.length !== i ? "," : ""}`;
            });
            arrayText += "\n]";
            arrays.push(arrayText);
          }

          text += arrays.join(",\n");
          text += "\n}";

          interaction.editReply({
            content: client.translation.get(
              guildDb?.language,
              "wyCustom.success.export"
            ),
            files: [
              {
                attachment: Buffer.from(text),
                name: `Custom_Messages_${interaction.guild?.id}.json`,
              },
            ],
          });
          return;
        }
      }
    } else {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Language.embed.error")
        );
      interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
    }
  },
};

export default command;
