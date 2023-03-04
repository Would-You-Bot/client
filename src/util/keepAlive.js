require('dotenv')
    .config();

const {
    WebhookClient,
    EmbedBuilder,
} = require('discord.js');

const {inspect} = require('util');
const {ChalkAdvanced} = require("chalk-advanced");

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
     * Log a message to the console
     * @param type
     * @param msg
     * @param _optionalData
     * @private
     */
    consoleError(type, msg, _optionalData = '') {
        console.log(
            `${ChalkAdvanced.white(type)} ${ChalkAdvanced.gray(
                '>',
            )} ${ChalkAdvanced.red(msg)}`,
            _optionalData,
        );
    }

    /**
     * Start the keep alive system (listener to the process)
     */
    start() {
        this.c.rest.on('rateLimited', (log) => {
            const { route: path, limit, timeToReset: timeout } = log;
            this.consoleError('RateLimited', 'We got rate-limited at', `Path: ${path} Limit: ${limit} Timeout: ${timeout}`);
            const embed = new EmbedBuilder()
                .setTitle('Rate limited')
                .setColor(global?.devBot ? "#e407f5" : "#6e0000")
                .addFields([{
                    name: 'Rate-limit Info',
                    value: `Path: \`${path}\`\nLimit: \`${limit}\`\nTimeout: \`${timeout}\``,
                }])
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            warnWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        })

        this.c.on('debug', (e) => {
            if (!e.includes('ratelimit')) return;

            this.consoleError('Debug', 'Watch-out Possible Rate-limit...', e);
            const embed = new EmbedBuilder()
                .setTitle('Watch-out Possible Rate-limit...')
                .setColor(global?.devBot ? "#e407f5" : "#F00505")
                .addFields([{
                    name: 'Info',
                    value: `\`\`\`${inspect(e, {depth: 0})}\`\`\``,
                }])
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            warnWebhook
                .send({
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        this.c.on('error', (e) => {
            this.consoleError('Error', 'Bot got a error...', e);
            const embed = new EmbedBuilder()
                .setTitle('Bot got a error...')
                .setColor(global?.devBot ? "#e407f5" : "#05b1f0")
                .addFields([{
                    name: 'Error',
                    value: `\`\`\`${inspect(e, {depth: 0})}\`\`\``,
                }])
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            errorWebhook
                .send({
                    username: global?.devBot ? 'Dev Bot' : 'Main Bot',
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        this.c.on('warn', async (info) => {
            this.consoleError('Error', 'Bot got a warn...', info);
            const embed = new EmbedBuilder()
                .setTitle('Bot got a warn...')
                .setColor(global?.devBot ? "#e407f5" : "#05b1f0")
                .addFields([{
                    name: 'Info',
                    value: `\`\`\`${inspect(info, {depth: 0})}\`\`\``,
                }])
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            warnWebhook
                .send({
                    username: global?.devBot ? 'Dev Bot' : 'Main Bot',
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        process.on('unhandledRejection', async (reason, p) => {
            this.consoleError('Fatal Error', 'Unhandled Rejection/Catch');
            console.log(reason, p);

            const embed = new EmbedBuilder()
                .setTitle('New Unhandled Rejection/Catch')
                .setDescription(`\`\`\`${reason}\`\`\``)
                .setColor(global?.devBot ? "#e407f5" : "#F00505")
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
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            errorWebhook
                .send({
                    username: global?.devBot ? 'Dev Bot' : 'Main Bot',
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });

        process.on('uncaughtException', async (err, origin) => {
            this.consoleError('Fatal Error', 'Uncaught Exception/Catch');
            console.log(err, origin);

            const embed = new EmbedBuilder()
                .setTitle('New uncaughtException')
                .setDescription(`\`\`\`${err}\`\`\``)
                .setColor(global?.devBot ? "#e407f5" : "#F00505")
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
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            errorWebhook
                .send({
                    username: global?.devBot ? 'Dev Bot' : 'Main Bot',
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });
        process.on('uncaughtExceptionMonitor', async (err, origin) => {
            this.consoleError('Fatal Error', 'Uncaught Exception/Catch (MONITOR)');
            console.log(err, origin);

            const embed = new EmbedBuilder()
                .setTitle('New uncaughtExceptionMonitor' + `${global?.CustomBot ? ' (Custom Bot)' : ''}`)
                .setDescription(`\`\`\`${err}\`\`\``)
                .setColor(global?.devBot ? "#e407f5" : "#F00505")
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
                .setFooter({
                    text: global?.devBot ? 'Dev Bot' : 'Main Bot',
                })
                .setTimestamp();

            errorWebhook
                .send({
                    username: global?.devBot ? 'Dev Bot' : 'Main Bot',
                    embeds: [embed],
                })
                .catch((err) => {
                });
        });
    }
}