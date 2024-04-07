import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

type BetterRESTPostAPIApplicationCommandsJSONBody =
  RESTPostAPIApplicationCommandsJSONBody & {
    contexts?: number[] | undefined;
    integration_types?: number[] | undefined;
  };

const userCommands = [
  "dare",
  "truth",
  "random",
  "wouldyourather",
  "neverhaveiever",
  "higherlower",
  "whatwouldyoudo",
  "leaderboard",
  "privacy",
  "language"
];

export default function supportAppCommands(
  commands: BetterRESTPostAPIApplicationCommandsJSONBody[],
): BetterRESTPostAPIApplicationCommandsJSONBody[] {
  for (const command of commands) {
    if (userCommands.includes(command.name)) {
      command.contexts = [0, 1, 2];
      command.integration_types = [0, 1];
    }
  }
  return commands;
}
