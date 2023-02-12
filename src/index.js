const WouldYou = require('./util/wouldYou');
const {ChalkAdvanced} = require("chalk-advanced");

// Token to UserID Function
// Credits to Meister#9667 for helping me with this
const retriveUserIdbyToken = (token) => {
    const parseuser = (token.split('.'))[0]
    const buff = Buffer.from(parseuser, 'base64');
    const userid = buff.toString('utf-8');
    return userid;
}

global.devBot = false;

const botId = retriveUserIdbyToken(process.env.DISCORD_TOKEN);
if(botId !== '981649513427111957' || process.env.STATUS === 'DEVELOPMENT') {
    global.devBot = true;
} else if(process.env.STATUS === 'DEVELOPMENT' && botId === '981649513427111957') {
    throw new Error('Are you stupid? Why should you run the main bot with status "DEVELOPMENT"?!');
}

const client = new WouldYou();
client.loginBot().then(() => {
  console.log(
      `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
          '>',
      )} ${ChalkAdvanced.green('Bot should be started now...')}`,
  );
})
