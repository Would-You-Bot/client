import { AnySelectMenuInteraction, ButtonInteraction, ChannelSelectMenuInteraction, Interaction as dInteraction, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from 'discord.js';
import WouldYou from '../util/wouldYou';

export interface Interaction {
    name: string;
    execute(client: WouldYou, interaction: dInteraction): Promise<void>;
}

export interface Button extends Interaction {
    execute(client: WouldYou, interaction: ButtonInteraction): Promise<void>
}

export interface ModalSubmit extends Interaction {
    execute(client: WouldYou, interaction: ModalSubmitInteraction): Promise<void>
}

export interface AnySelectMenu extends Interaction {
    execute(client: WouldYou, interaction: AnySelectMenuInteraction): Promise<void>
}

export interface StringSelectMenu extends AnySelectMenu {
    execute(client: WouldYou, interaction: StringSelectMenuInteraction): Promise<void>
}

export interface MentionableSelectMenu extends AnySelectMenu {
    execute(client: WouldYou, interaction: MentionableSelectMenuInteraction): Promise<void>
}

export interface ChannelSelectMenu extends AnySelectMenu {
    execute(client: WouldYou, interaction: ChannelSelectMenuInteraction): Promise<void>
}

export interface RoleSelectMenu extends AnySelectMenu {
    execute(client: WouldYou, interaction: RoleSelectMenuInteraction): Promise<void>
}

export interface UserSelectMenu extends AnySelectMenu {
    execute(client: WouldYou, interaction: UserSelectMenuInteraction): Promise<void>
}