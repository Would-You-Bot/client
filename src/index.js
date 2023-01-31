const WouldYou = require('./util/wouldYou');
const {ChalkAdvanced} = require("chalk-advanced");

const client = new WouldYou();
client.loginBot().then(() => {
  console.log(
      `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
          '>',
      )} ${ChalkAdvanced.green('Bot should be started now...')}`,
  );
})
