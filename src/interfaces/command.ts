import {
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { IGuildModel } from "../util/Models/guildModel";
import WouldYou from "../util/wouldYou";

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
