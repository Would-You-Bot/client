const guildcreate = require("../util/Models/guildModel.ts");
const userModel = require("../util/Models/userModel.ts");

module.exports = (interaction) => {
  userModel.findOne({ userID: interaction.user.id }).then(async (result) => {
    if (!result) {
      await userModel.create({
        userID: interaction.user.id,
        blacklisted: false,
      });
    } else {
      return;
    }
      if ((result.blacklisted == "true")) {
        return interaction.reply({
          content:
            "You are blacklisted from using this bot. Join our [support server](discord.gg/KfBkKKydfg) to appeal your ban!",
        });
      } else {
        if (!interaction.guild) {
          interaction.reply({
            content: "You need to be in a server to use this command.",
            ephemeral: true,
          });
        } else {
          guildcreate
            .findOne({ guildID: interaction.guild.id })
            .then(async (result) => {
              if (!result) {
                await guildcreate.create({
                  guildID: interaction.guild.id,
                  language: "en_EN",
                  botJoined: (Date.now() / 1000) | 0,
                });
              } else {
              }

              const { client } = interaction;
              if (!interaction.isCommand()) return;
              const command = client.commands.get(interaction.commandName);
              if (!command) return;
              try {
                command.execute(interaction, client);
              } catch (err) {
                if (err) console.error(err);
                interaction.reply({
                  content:
                    "An error occurred while trying to execute that command.",
                  ephemeral: true,
                });
              }
            });
        }
      }
    },
  )};

