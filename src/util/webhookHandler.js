const {
    PermissionFlagsBits,
    WebhookClient,
    EmbedBuilder
} = require('discord.js');

module.exports = class WebhookHandler {
    constructor(client) {
        this.webhooks = new Map();
        this.webhookModel = require('../util/Models/webhookCache');

        if (!client) throw new Error("No client provided");

        this.c = client;
    }

    /**
     * Get a webhook from the cache and if not in cache fetch it
     * @param {string} channelId the channel id
     * @return {Promise<object>}
     * @private
     */
    getWebhook = async (channelId) => {
        if (this.webhooks.has(`${channelId}`)) return this.webhooks.get(channelId);

        const data = await this.webhookModel.findOne({
            channelId: channelId
        });
        if (data) {
            this.webhooks.set(`${channelId}`, {
                id: data.webhookId,
                token: data.webhookToken
            });

            return {
                id: data.webhookId,
                token: data.webhookToken
            }
        } else return null;
    }

    /**
     * Create a webhook in a channel & save it to the database and cache
     * @param {object | null} channel the channel to create the webhook in
     * @param {string} channelId the channel id
     * @param {string} name the name of the webhook
     * @param {string} avatar the avatar of the webhook (url)
     * @param {string} reason the reason for creating the webhook
     * @return {Promise<object>}
     * @private
     */
    createWebhook = async (channel = null, channelId, name, avatar, reason) => {
        if (!channel) channel = await this.c.channels.fetch(channelId).catch((err) => {
        });

        if (!channel) return null;

        if (!channel?.permissionsFor(this.c?.user?.id).has([PermissionFlagsBits.ManageWebhooks])) return null;

        const webhook = await channel.createWebhook({
            name: name ?? 'Would You',
            avatar: avatar ?? this.c.user.displayAvatarURL(),
            reason: reason ?? 'Would You Webhook'
        }).catch(err => {
            return err
        });

        if (webhook?.id) {
            this.webhooks.set(`${channelId}`, {
                id: webhook.id,
                token: webhook.token
            });

            const oldData = await this.webhookModel.findOne({
                channelId: channelId
            });

            if (oldData) {
                await oldData.updateOne({
                    channelId: channelId,
                    webhookId: webhook.id,
                    webhookToken: webhook.token
                });
            } else {
                await this.webhookModel.create({
                    channelId: channelId,
                    webhookId: webhook.id,
                    webhookToken: webhook.token
                });
            }

            return {
                id: webhook.id,
                token: webhook.token
            }
        } else return null;
    }

    webhookFallBack = async (channel = null, channelId, message, err = false) => {
        if (!channel) channel = await this.c.channels.fetch(channelId).catch((err) => {
        });

        if (!channel) return;

        if (err && (err?.code === 10015 || `${err?.message}`?.inlcudes('Unknown Webhook')) && channel?.permissionsFor(this.c?.user?.id).has([PermissionFlagsBits.ManageWebhooks])) {
            const webhooks = await channel.fetchWebhooks();

            if (webhooks && webhooks.size > 0) {
                let i = 0;
                webhooks.forEach(web => {
                    i++;
                    setInterval(() => {
                        if (web?.owner?.id === this.c?.user?.id) {
                            web.delete('Deleting old webhook, to create a new one')
                                .catch((err) => {
                                });
                        }
                    }, 1000 * i);
                });
            }

            const webhook = await this.createWebhook(channel, channelId, 'Would You', this.c.user.displayAvatarURL(), 'Webhook token unavailable, creating new webhook');

            if (!webhook?.id || !webhook.token) return this.webhookFallBack(channel, channelId, message, false);

            const webhookClient = new WebhookClient({id: webhook.id, token: webhook.token});
            if (!webhookClient) return this.webhookFallBack(channel, channelId, message, false);

            webhookClient
                .send(message)
                .catch(async err => {
                    return this.webhookFallBack(channel, channelId, message, false);
                });
        } else {
            if (channel?.permissionsFor(this.c?.user?.id).has([PermissionFlagsBits.EmbedLinks])) {
                const guildSettings = await this.c.database.getGuild(channel.guild.id);

                message.embeds = message?.embeds ?? [];

                message.embeds.unshift(
                    new EmbedBuilder()
                        .setColor('#FE0001')
                        .setDescription('🛑 ' + this.c.translation.get(guildSettings?.language ?? 'en_EN', 'webhookManager.noWebhook'))
                );

                return channel
                    .send(message)
                    .catch(err => {
                        console.log(err);
                        console.log(message);
                    });
            }
        }
    }

    /**
     * Send a message to a channel with a webhook
     * @param {object} channel the channel to send the message to
     * @param {string} channelId the channel id
     * @param {object} message the message to send
     * @return {Promise<object>}
     */
    sendWebhook = async (channel = null, channelId, message) => {
        if (!channelId && channel?.id) channelId = channel.id;

        if (!channelId) return;

        const webhookData = await this.getWebhook(channelId);

        if (webhookData?.webhookId) webhookData.id = webhookData.webhookId;
        if (webhookData?.webhookToken) webhookData.token = webhookData.webhookToken;

        if (!webhookData?.id || !webhookData?.token) {
            let webhook = await this.createWebhook(channel, channelId, 'Would You', this.c.user.displayAvatarURL(), 'Webhook token unavailable, creating new webhook');

            if (webhook?.webhookId) webhook.id = webhook.webhookId;
            if (webhook?.webhookToken) webhook.token = webhook.webhookToken;

            if (!webhook?.id || !webhook?.token) return this.webhookFallBack(channel, channelId, message, false);

            const webhookClient = new WebhookClient({id: webhook.id, token: webhook.token});
            if (!webhookClient) return this.webhookFallBack(channel, channelId, message, false);

            webhookClient
                .send(message)
                .catch(err => {
                    return this.webhookFallBack(channel, channelId, message, false);
                });
        } else {
            const webhook = new WebhookClient({id: webhookData?.id, token: webhookData?.token});
            if (!webhook) return this.webhookFallBack(channel, channelId, message);

            webhook
                .send(message)
                .catch(err => {
                    return this.webhookFallBack(channel, channelId, message, err);
                });
        }
    }
};
