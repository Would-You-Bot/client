import {
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import WouldYou from "../util/wouldYou";
import { IGuildModel } from "../util/Models/guildModel";

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
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
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute(
    interaction: ChatInputCommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ): Promise<void>;
}
