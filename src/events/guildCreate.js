const guildcreate = require('../util/Models/guildModel');

module.exports = (guild) => {
  guildcreate.findOne({ guildID: guild.id }).then(async (result) => {
    if (!result) {
      await guildcreate.create({
        guildID: guild.id,
        language: 'en_EN',
        botJoined: (Date.now() / 1000) | 0,
      });
    } else {

    }
  });
};
