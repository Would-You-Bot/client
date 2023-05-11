const { ChalkAdvanced } = require('chalk-advanced');

export default async (client, id) => {
  console.log(
    `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
      '>'
    )} ${ChalkAdvanced.green(`Shard ${id} reconnecting...`)}`
  );
};
