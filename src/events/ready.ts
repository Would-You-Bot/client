import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { white, gray, green, red } from "chalk-advanced";
import { captureException } from "@sentry/node";
import WouldYou from "../util/wouldYou";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { Event } from "../models/event";
import axios from "axios";
import { getInfo } from "discord-hybrid-sharding";

const event: Event = {
  event: "ready",
  execute: async (client: WouldYou) => {
    if (client.cluster.id === 0) {
      let globalCommands = Array.from(
        client.commands.filter((x) => x.requireGuild === true).values(),
      ).map((x) => x.data.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[];

      const rest = new REST({
        version: "10",
      }).setToken(process.env.DISCORD_TOKEN as string);

      setTimeout(async () => {
        try {
          if (process.env.PRODUCTION === "true") {
            // Post data to top.gg
            const postStats = async () => {
              const serverCount = await client.cluster.broadcastEval(
                (c) => c.guilds.cache.size,
              );

              await axios({
                method: "POST",
                url: `https://top.gg/api/bots/981649513427111957/stats`,
                headers: {
                  Authorization: process.env.TOPGG_TOKEN,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                data: {
                  server_count: serverCount.reduce(
                    (prev, val) => prev + val,
                    0,
                  ),
                  shard_count: getInfo().TOTAL_SHARDS,
                },
              }).catch((err) => {
                console.log(err);
              });
            };
            setInterval(postStats, 3600000);
            // If the bot is in production mode it will load slash commands for all guilds
            if (client.user?.id) {
              await rest.put(Routes.applicationCommands(client.user.id), {
                body: globalCommands,
              });
            }
            console.log(
              `${white("Would You?")} ${gray(">")} ${green(
                "Successfully registered commands globally",
              )}`,
            );
          } else {
            if (!process.env.TEST_GUILD_ID)
              return console.log(
                red(
                  "Looks like your bot is not in production mode and you don't have a guild id set in .env",
                ),
              );
            if (client.user?.id) {
              console.log(client.user?.id);
              await rest.put(
                Routes.applicationGuildCommands(
                  client.user.id,
                  process.env.TEST_GUILD_ID as string,
                ),
                {
                  body: globalCommands,
                },
              );
            }
            console.log(
              `${white("Would You?")} ${gray(">")} ${green(
                "Successfully registered commands locally",
              )}`,
            );
          }
        } catch (err) {
          captureException(err);
        }
      }, 2500);
    }
  },
};

export default event;
