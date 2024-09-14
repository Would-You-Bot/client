import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { IGuildModel } from "../util/Models/guildModel";
import type WouldYou from "../util/wouldYou";

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder;
  requireGuild?: boolean;
  integration_types?: number[];
  contexts?: number[];
  execute(
    interaction: CommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ): Promise<void>;
}

export interface ChatInputCommand extends Command {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute(
    interaction: ChatInputCommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ): Promise<void>;
}
