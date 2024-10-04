import { captureException } from "@sentry/node";
import { gray, green, white } from "chalk-advanced";
import { type Model, connect, set } from "mongoose";
import { GuildModel, type IGuildModel } from "./Models/guildModel";
import { type IUserModel, UserModel } from "./Models/userModel";
import type WouldYou from "./wouldYou";

export default class DatabaseHandler {
	private cache: Map<string, IGuildModel>;
	private userCache: Map<string, IUserModel>;
	private userModel: Model<IUserModel>;
	private guildModel: Model<IGuildModel>;
	private connectionString: string;
	/**
	 * Create a database handler
	 * @param {string} connectionString the connection string
	 */
	constructor(connectionString: string) {
		this.cache = new Map();
		this.userCache = new Map();
		this.guildModel = GuildModel;
		this.userModel = UserModel;
		this.connectionString = connectionString;
	}

	/**
	 * This is the cache sweeper to keep the cache clean!
	 * @param client the client object
	 */
	startSweeper(client: WouldYou) {
		setInterval(
			() => {
				const guilds = this.cache.values();
				for (const g of guilds) {
					if (!client?.guilds?.cache?.has(g?.guildID)) {
						this.cache.delete(g?.guildID);
					}
				}
			},
			60 * 60 * 1000,
		);
	}

	/**
	 * Connect to the mongoose database
	 * @returns {Promise<void>}
	 */
	async connectToDatabase(): Promise<void> {
		set("strictQuery", true);
		await connect(this.connectionString)
			.catch((err) => {
				captureException(err);
			})
			.then(() => console.log(`${white("Database")} ${gray(">")} ${green("Successfully loaded database")}`));
	}

	/**
	 * Fetch a guild from the database (Not suggested use .get()!)
	 * @param {number|string} guildId the server id
	 * @param {boolean} createIfNotFound create a database entry if not found
	 * @returns {this.guildModel}
	 * @private
	 */
	async fetchGuild(guildId: number | string, createIfNotFound = false) {
		const fetched = await this.guildModel.findOne({
			guildID: guildId as string,
		});

		if (fetched) return fetched;
		if (!fetched && createIfNotFound) {
			await this.guildModel.create({
				guildID: guildId,
				language: "en_EN",
				botJoined: (Date.now() / 1000) | 0,
			});

			return this.guildModel.findOne({ guildID: guildId as string });
		}
		return null;
	}

	/**
	 * Get a guild database from the cache
	 * @param {string} guildId the server id
	 * @param {boolean} createIfNotFound create a database entry if not found
	 * @param {boolean} force if it should force fetch the guild
	 * @returns {this.guildModel}
	 */
	async getGuild(guildId: string, createIfNotFound = true, force = false): Promise<IGuildModel | null> {
		const fetched = await this.fetchGuild(guildId, createIfNotFound);
		if (fetched) {
			this.cache.set(guildId, fetched?.toObject() ?? fetched);

			return this.cache.get(guildId) || null;
		}
		return null;
	}

	/**
	 * Delete a guild from the db and the cache
	 * @param {number|string} guildId the server id
	 * @param {boolean} onlyCache if you want to only delete the cache
	 * @returns {Promise<deleteMany|boolean>}
	 */
	async deleteGuild(guildId: number | string, onlyCache = false) {
		if (this.cache.has(guildId.toString())) this.cache.delete(guildId.toString());

		return onlyCache ? true : this.guildModel.deleteMany({ guildID: guildId as string });
	}

	/**
	 * Update the settings from a guild
	 * @param {string} guildId the server id
	 * @param {object | this.guildModel} data the updated or new data
	 * @param {boolean} createIfNotFound create a database entry if not found
	 * @returns {Promise<this.guildModel|null>}
	 */
	async updateGuild(guildId: string, data: object | IGuildModel, createIfNotFound = false) {
		return this.guildModel.updateOne(
			{
				guildID: guildId,
			},
			data,
		);
	}

	/**
	 * Fetch a user from the database (Not suggested use .get()!)
	 * @param {number|string} userId the user id
	 * @param {boolean} createIfNotFound create a database entry if not found
	 * @returns {this.userModel}
	 * @private
	 */
	async fetchUser(userId: number | string, createIfNotFound = false) {
		const fetched = await this.userModel.findOne({
			userID: userId,
		});

		if (fetched) return fetched;
		if (!fetched && createIfNotFound) {
			await this.userModel.create({
				userID: userId,
			});

			return this.userModel.findOne({ userID: userId });
		}
		return null;
	}

	/**
	 * Get a user database from the cache
	 * @param {string} userId the user id
	 * @param {boolean} createIfNotFound create a database entry if not found
	 * @param {boolean} force if it should force fetch the user
	 * @returns {this.userModel}
	 */
	async getUser(userId: string, createIfNotFound = true, force = false): Promise<IUserModel | null> {
		if (force) return this.fetchUser(userId, createIfNotFound);

		if (this.userCache.has(userId)) {
			return this.userCache.get(userId) || null;
		}

		const fetched = await this.fetchUser(userId, createIfNotFound);
		if (fetched) {
			this.userCache.set(userId, fetched?.toObject() ?? fetched);

			return this.userCache.get(userId) || null;
		}
		return null;
	}

	/**
	 * Delete a user from the db and the cache
	 * @param {number|string} userId the user id
	 * @param {boolean} onlyCache if you want to only delete the cache
	 * @returns {Promise<deleteMany|boolean>}
	 */
	async deleteUser(userId: number | string, onlyCache = false) {
		if (this.userCache.has(userId.toString())) this.userCache.delete(userId.toString());

		return onlyCache ? true : this.userModel.deleteMany({ userID: userId });
	}

	/**
	 * Update the settings from a user
	 * @param {number|string} userId the user id
	 * @param {object | this.userModel} data the updated or new data
	 * @param {boolean} createIfNotFound create a database entry if not found
	 * @returns {Promise<this.userModel|null>}
	 */

	async updateUser(userId: number | string, data: object | IUserModel, createIfNotFound = false) {
		const oldData = await this.getUser(userId.toString(), createIfNotFound);

		if (oldData) {
			const newData = { ...oldData, ...data };

			this.userCache.set(userId.toString(), newData as IUserModel);
			return this.userModel.updateOne(
				{
					userID: userId,
				},
				newData,
			);
		}
		return null;
	}

	/**
	 * Fetch all available settings
	 * @returns {Promise<this.guildModal[]>}
	 */
	async getAll() {
		return this.guildModel.find();
	}
	/**
	 * @name getAllActiveDailyMessageGuilds
	 * @description Fetch all the active dailyMessage guilds.
	 * @returns {Promise<IGuildModel[]>}
	 */
	async getAllActiveDailyMessageGuilds(): Promise<IGuildModel[]> {
		return this.guildModel.find({ dailyMsg: true });
	}
}
