import { captureException } from "@sentry/node";
import { SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Checks shit about shard stats hehe looool")
    .setDMPermission(false),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const results = await client.cluster.broadcastEval((client: any) => {
      const shards = [];
      for (const [_key, value] of client.ws.shards) {
        const { id, status, ping } = value;
        shards.push({
          clusterid: client.cluster.id,
          shardid: id,
          status,
          ping,
        });
      }

      return {
        guilds: client.guilds.cache.size,
        members: client.guilds.cache.reduce(
          (acc: any, guild: any) => acc + guild.memberCount,
          0,
        ),
        shards,
      };
    });

    if (!results) return;

    const shards = results.reduce(
      (acc: any, item: any) => {
        acc.shards = acc.shards.concat(item.shards);
        acc.guilds += item.guilds;
        acc.members += item.members;
        return acc;
      },
      { shards: [], guilds: 0, members: 0 },
    );
    console.log(shards);
    await interaction
      .reply({
        content: `Shard Ping:}`,
        ephemeral: false,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
