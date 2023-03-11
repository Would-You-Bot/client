const {Schema, model} = require('mongoose');

const guildProfile = new Schema(
    {
        guildID: {
            type: String,
            required: true,
            unique: true,
        },
        language: {
            type: String,
            default: 'en_EN',
            required: true,
        },
        welcome: {
            type: Boolean,
            default: false,
        },
        welcomeChannel: {
            type: String,
            default: null,
        },
        welcomePing: {
            type: Boolean,
            default: false,
        },
        dailyMsg: {
            type: Boolean,
            default: false,
        },
        dailyChannel: {
            type: String,
            default: null,
        },
        dailyRole: {
            type: String,
            default: null,
        },
        dailyTimezone: {
            type: String,
            default: "America/Chicago"
        },
        replay: {
            type: Boolean,
            default: true,
        },
        replayCooldown: {
            type: Number,
            default: 30000,
        },
        voteCooldown: {
            type: Number,
            default: 25000,
        },
        botJoined: {
            type: Number,
        },
        customMessages: [{
            type: Object,
            default: {},
        },],
        customTypes: {
            type: String,
            default: "mixed"
        },
        debugMode: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true},
);

module.exports = model('guildProfile', guildProfile);
