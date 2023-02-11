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
        dailyDay: {
            type: Number,
            default: 0,
        },
        replay: {
            type: Boolean,
            default: true,
        },
        replayCooldown: {
            type: Number,
            default: 30000,
        },
        votingCooldown: {
            type: Number,
            default: 20000,
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
    },
    {timestamps: true},
);

module.exports = model('guildProfile', guildProfile);
