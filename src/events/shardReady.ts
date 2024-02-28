import { gray, white, green } from "chalk-advanced";
import WouldYou from "../util/wouldYou";
import { Event } from "../models/event";

const event: Event = {
  event: "shardReady",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(
        "Shard is now ready #" + id,
      )}`,
    );
    const random = [
      "Would You Rather",
      "Truth or Dare",
      "What Would You Do",
      "Higher or Lower",
      "Never Have I Ever",
    ];
    const randomStatus = random[Math.floor(Math.random() * random.length)];

    const setStatus = () => {
      if (!client.user) return;

      client.user.setPresence({
        activities: [
          {
            name: `${randomStatus || "Would You?"}`,
          },
        ],
        status: "dnd",
        shardId: id,
      });
    };

    setTimeout(() => setStatus(), 35 * 1000);
    setInterval(() => setStatus(), 60 * 60 * 1000);
  },
};

export default event;
