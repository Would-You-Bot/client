const {Schema, model} = require('mongoose');

const webhookCache = Schema({
    channelId: {
        type: String,
        default: null,
    },
    webhookId: {
        type: String,
        default: null,
    },
    webhookToken: {
        type: String,
        default: null,
    }
});

module.exports = model('webhookCache', webhookCache);
