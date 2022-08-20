const { readdir } = require('fs');

module.exports = async (client) => {
  readdir('./src/events/', (err, files) => {
    if (err) return console.error(err);

    files.forEach((file) => {
      const event = require(`../events/${file}`);
      const eventName = file.split('.')[0];
      client.on(eventName, event.bind(client));
    });
  });
};
