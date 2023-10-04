const { ChalkAdvanced } = require("chalk-advanced");

module.exports = async (client, id) => {
  console.log(
    `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
      ">",
    )} ${ChalkAdvanced.green(`Shard ${id} resumed`)}`,
  );
};
