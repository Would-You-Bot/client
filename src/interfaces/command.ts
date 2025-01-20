import type {
  ChatInputCommandInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  CacheType,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  InteractionResponse,
  AutocompleteInteraction,
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
  cooldown?: boolean;
  integration_types?: number[];
  contexts?: number[];
  execute(
    interaction: CommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ):
    | Promise<void>
    | ChatInputCommandInteraction<CacheType>
    | InteractionResponse;
}

export interface ChatInputCommand extends Command {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  cooldown?: boolean;
  execute(
    interaction: ChatInputCommandInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ): any;
  autocomplete?(
    interaction: AutocompleteInteraction,
    guildDb: IGuildModel,
  ): any;
}
