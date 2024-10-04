import { captureException } from "@sentry/node";
import { gray, green, white } from "chalk-advanced";
import type { Event } from "../interfaces/event";
import { shardClusterStoreModel } from "../util/Models/ShardClusterStore";
import type WouldYou from "../util/wouldYou";

const event: Event = {
	event: "shardDeath",
	execute: async (client: WouldYou, id: number) => {
		console.log(`${white("Would You?")} ${gray(">")} ${green(`Shard ${id} is death.`)}`);

		shardClusterStoreModel
			.findOneAndDelete({ shard: id, cluster: client.cluster.id })
			.catch((err: string) => captureException(err));
	},
};

export default event;
