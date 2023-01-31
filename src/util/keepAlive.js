require('dotenv')
    .config();

const {
    WebhookClient,
    EmbedBuilder,
} = require('discord.js');

const {inspect} = require('util');

const warnWebhook = new WebhookClient({
    url: process.env.WARNWEBHOOKURL,
});
const errorWebhook = new WebhookClient({
    url: process.env.ERRORWEBHOOKURL,
});

module.exports = class KeepAlive {
    constructor(client) {
        this.c = client;
    }

    /**
     * Start the keep alive system (listener to the process)
     */
    start() {
        this.c.on('debug', (e) => {
            if (!e.includes('ratelimit')) return;

            console.log('[BOT] Watch-out Possible Rate-limit...\n', e);
            const embed = new EmbedBuilder()
                .setTitle('Watch-out Possible Rate-limit...')
                .addFields([{
                    name: 'Info',
                    value: `\`\`\`${inspect(e, {depth: 0})}\`\`\``,
                }])
                .setTimestamp();

            warnWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        this.c.on('error', (e) => {
            console.log('[BOT] Bot got a error...\n\n', e);
            const embed = new EmbedBuilder()
                .setTitle('Bot got a error...')
                .addFields([{
                    name: 'Error',
                    value: `\`\`\`${inspect(e, {depth: 0})}\`\`\``,
                }])
                .setTimestamp();

            errorWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        this.c.on('warn', async (info) => {
            console.log('[BOT] Bot got a warn...\n\n', info);
            const embed = new EmbedBuilder()
                .setTitle('Bot got a warn...')
                .addFields([{
                    name: 'Info',
                    value: `\`\`\`${inspect(info, {depth: 0})}\`\`\``,
                }])
                .setTimestamp();

            warnWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        process.on('unhandledRejection', async (reason, p) => {
            console.log('[BOT | FATAL ERROR] Unhandled Rejection/Catch');
            console.log(reason, p);

            const embed = new EmbedBuilder()
                .setTitle('New Unhandled Rejection/Catch')
                .setDescription(`\`\`\`${reason}\`\`\``)
                .setColor('#4E5D94')
                .addFields([
                    {
                        name: 'Reason',
                        value: `\`\`\`${inspect(reason, {depth: 0})}\`\`\``,
                    },
                    {
                        name: 'Promise',
                        value: `\`\`\`${inspect(p, {depth: 0})}\`\`\``,
                    },
                ])
                .setTimestamp();

            errorWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        process.on('uncaughtException', async (err, origin) => {
            console.log('[BOT | FATAL ERROR] Uncaught Exception/Catch');
            console.log(err, origin);

            const embed = new EmbedBuilder()
                .setTitle('New uncaughtException')
                .setDescription(`\`\`\`${err}\`\`\``)
                .setColor('#4E5D94')
                .addFields([
                    {
                        name: 'Error',
                        value: `\`\`\`${inspect(err, {depth: 0})}\`\`\``,
                    },
                    {
                        name: 'Origin',
                        value: `\`\`\`${inspect(origin, {depth: 0})}\`\`\``,
                    },
                ])
                .setTimestamp();

            errorWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });
        process.on('uncaughtExceptionMonitor', async (err, origin) => {
            console.log('[BOT | FATAL ERROR] Uncaught Exception/Catch (MONITOR)');
            console.log(err, origin);

            const embed = new EmbedBuilder()
                .setTitle('New uncaughtExceptionMonitor' + `${global?.CustomBot ? ' (Custom Bot)' : ''}`)
                .setDescription(`\`\`\`${err}\`\`\``)
                .setColor('#4E5D94')
                .addFields([
                    {
                        name: 'Error',
                        value: `\`\`\`${inspect(err, {depth: 0})}\`\`\``,
                    },
                    {
                        name: 'Origin',
                        value: `\`\`\`${inspect(origin, {depth: 0})}\`\`\``,
                    },
                ])
                .setTimestamp();

            errorWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });
    }
}
