import { ButtonInteraction, Interaction as dInteraction } from 'discord.js';
import WouldYou from '../util/wouldYou';

export interface Interaction {
    name: string;
    execute(interaction: dInteraction, client: WouldYou, guildDb: any): Promise<void>;
}

export interface Button extends Interaction {
    execute(interaction: ButtonInteraction, client: WouldYou, guildDb: any): Promise<void>
}