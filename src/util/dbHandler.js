const {connect} = require('mongoose');
require('dotenv').config();

const {ChalkAdvanced} = require('chalk-advanced');
const guildModel = require("./Models/guildModel");

const cache = new Map();

/**
 * This is the cache sweeper to keep the cache clean!
 * @param client the client object
 * @private
 */
function startSweeper(client)  {
    setInterval(() => {
        const guilds = cache.values();
        for(const g of guilds) {
            if(!client?.guilds?.cache?.has(g?.guildID)) {
                cache.delete(g?.guildID);
            }
        }
    }, 60 * 60 * 1000)
}

/**
 * Connect to the mongoose database
 * @returns {Promise<void>}
 */
async function connectToDatabase() {
    connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
    }).catch((err) => {
        console.log(err)
    }).then(() => console.log(
        `${ChalkAdvanced.white('Database')} ${ChalkAdvanced.gray(
            '>',
        )} ${ChalkAdvanced.green('Successfully loaded database')}`,
    ));
}

/**
 * Fetch a guild from the database (Not suggested use .get()!)
 * @param {number|string} guildId the server id
 * @param {boolean} createIfNotFound create a database entry if not found
 * @returns {guildModel}
 * @private
 */
async function fetchGuild(guildId, createIfNotFound = false) {
    const fetched = await guildModel.findOne({guildID: guildId});

    if(fetched) return fetched;
    else if(!fetched && createIfNotFound) {
        await guildModel.create({
            guildID: guildId,
            language: 'en_EN',
            botJoined: Date.now() / 1000 | 0,
        });

        return setTimeout(async () => {
            return guildModel.findOne({guildID: guildId});
        })
    }
    else return null;
}

/**
 * Get a guild database from the cache
 * @param {number|string} guildId the server id
 * @param {boolean} createIfNotFound create a database entry if not found
 * @param {boolean} force if it should force fetch the guild
 * @returns {guildModel}
 */
async function getGuild(guildId, createIfNotFound = true, force = false) {
    if(force) return fetchGuild(guildId, createIfNotFound);

    if(cache.has(guildId)) return cache.get(guildId);

    const fetched = await fetchGuild(guildId, createIfNotFound);
    if(fetched) {
        cache.set(guildId, {
            fetched
        });

        return cache.get(guildId);
    } else return null;
}

/**
 * Delete a guild from the db and the cache
 * @param {number|string} guildId the server id
 * @param {boolean} onlyCache if you want to only delete the cache
 * @returns {Promise<deleteMany|boolean>}
 */
async function deleteGuild(guildId, onlyCache = false) {
    if(cache.has(guildId)) cache.delete(guildId);

    return !onlyCache ? guildModel.deleteMany({ guildID: guildId }) : true;
}

/**
 * Update the settings from a guild
 * @param {number|string} guildId the server id
 * @param {object | guildModel} data the updated or new data
 * @param {boolean} createIfNotFound create a database entry if not found
 * @returns {Promise<guildModel|null>}
 */
async function updateGuild(guildId, data = {}, createIfNotFound = false) {
    const oldData = await getGuild(guildId, createIfNotFound);

    if(oldData) {
        data = {
            // Set the old data
            ...oldData,

            // set the new data
            ...data
        };

        cache.set(guildId, data);

        return guildModel.updateOne({
            guildID: guildId
        }, data);
    } else return null;
}

/**
 * Fetch all available settings
 * @returns {Promise<guildModel>}
 */
async function getAll() {
    return guildModel.find().lean();
}

module.exports = {
    connectToDatabase,
    fetchGuild,
    getGuild,
    deleteGuild,
    updateGuild,
    startSweeper,
    getAll
};