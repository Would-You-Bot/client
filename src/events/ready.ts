import { REST } from "@discordjs/rest";
import { captureException } from "@sentry/node";
import { Redis } from "@upstash/redis";
import axios from "axios";
import { gray, green, red, white } from "chalk-advanced";
import { Routes } from "discord-api-types/v10";
import { getInfo } from "discord-hybrid-sharding";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import "dotenv/config";
import type { Event } from "../interfaces/event";
import type WouldYou from "../util/wouldYou";

// TODO: Clean up this file
const event: Event = {
	event: "ready",
	execute: async (client: WouldYou) => {
		if (client.cluster.id === 0) {
			const globalCommands = Array.from(client.commands.filter((x) => x.requireGuild === true).values()).map((x) =>
				x.data.toJSON(),
			) as RESTPostAPIApplicationCommandsJSONBody[];
			const rest = new REST({
				version: "10",
			}).setToken(process.env.DISCORD_TOKEN as string);

			const redis = new Redis({
				url: process.env.REDIS_URL!,
				token: process.env.REDIS_TOKEN!,
			});

			setTimeout(async () => {
				try {
					if (process.env.PRODUCTION === "true") {
						const loadServers = async () => {
							const featuredServers = await client.cluster.broadcastEval((c) =>
								c.guilds.cache.filter((g) => g.features.includes("PARTNERED") || g.features.includes("VERIFIED")),
							);

							const mergedServers = await featuredServers.reduce((result, array) => result.concat(array), []);

							const finalServer = mergedServers.map((server) => ({
								name: server.name,
								id: server.id,
								features: server.features,
								memberCount: server.memberCount,
								iconURL: server.iconURL,
								vanityURLCode: server.vanityURLCode,
							}));

							await redis.set("server_count", JSON.stringify(finalServer));
						};

						client.server.startServer();

						// Post data to top.gg
						const postStats = async () => {
							const serverCount = await client.cluster.broadcastEval((c) => c.guilds.cache.size);

							await axios({
								method: "POST",
								url: "https://top.gg/api/bots/981649513427111957/stats",
								headers: {
									Authorization: process.env.TOPGG_TOKEN,
									"Content-Type": "application/json",
									Accept: "application/json",
								},
								data: {
									server_count: serverCount.reduce((prev, val) => prev + val, 0),
									shard_count: getInfo().TOTAL_SHARDS,
								},
							}).catch((err) => {
								captureException(err);
							});
						};
						setInterval(postStats, 3600000);
						setTimeout(loadServers, 300000);
						setInterval(loadServers, 3600000 / 2);
						// If the bot is in production mode it will load slash commands for all guilds
						if (client.user?.id) {
							await rest.put(Routes.applicationCommands(client.user.id), {
								body: globalCommands,
							});
						}
						console.log(`${white("Would You?")} ${gray(">")} ${green("Successfully registered commands globally")}`);
					} else {
						if (!process.env.TEST_GUILD_ID)
							return console.log(
								red("Looks like your bot is not in production mode and you don't have a guild id set in .env"),
							);
						if (client.user?.id) {
							await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.TEST_GUILD_ID as string), {
								body: globalCommands,
							});
						}
						console.log(`${white("Would You?")} ${gray(">")} ${green("Successfully registered commands locally")}`);
					}
				} catch (err) {
					captureException(err);
				}
			}, 2500);
		}
	},
};

export default event;
