const { Schema, model } = require('mongoose');

const voteModel = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: false,
        },
        channelId: {
            type: String,
            required: true,
        },
        type: {
            type: Number,
            default: 0, // 0 = rather, 1 = would you
        },
        options: {
            1: {
                type: Array,
                default: [],
                required: false,
            },
            2: {
                type: Array,
                default: [],
                required: false,
            },
        },
        texts: {
            1: {
                type: String,
                default: '',
            },
            2: {
                type: String,
                default: '',
            }
        },

        // Timestamp in seconds until you can vote
        until: {
            type: Number,
            default: 0,
            required: false,
        }
    }
);

module.exports = model('voteModel', voteModel);
