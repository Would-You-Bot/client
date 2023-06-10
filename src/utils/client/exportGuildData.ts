import { CustomPackDocument, CustomPackModel } from '@models/CustomPack.model';
import {
  GuildProfileDocument,
  GuildProfileModel,
} from '@models/GuildProfile.model';
import { WebhookDocument, WebhookModel } from '@models/Webhook.model';

export interface GuildData {
  guildProfile?: GuildProfileDocument;
  webhooks?: WebhookDocument[];
  customPacks?: CustomPackDocument[];
}

/**
 * Export all data for a guild.
 * @param guildId The guild ID.
 * @returns A promise.
 */
const exportGuildData = async (guildId: string): Promise<GuildData> => {
  const guildData: GuildData = {
    guildProfile: undefined,
    webhooks: undefined,
    customPacks: undefined,
  };

  await Promise.all([
    async () => {
      const guildProfile = await GuildProfileModel.findOne({ guildId });
      if (guildProfile) guildData.guildProfile = guildProfile;
    },
    async () => {
      const webhooks = await WebhookModel.find({ guildId });
      guildData.webhooks = webhooks;
    },
    async () => {
      const customPacks = await CustomPackModel.find({ guildId });
      guildData.customPacks = customPacks;
    },
  ]);

  return guildData;
};

export default exportGuildData;
