import WouldYou from "./util/wouldYou";
import { white, gray, green } from "chalk-advanced";
import { init, autoDiscoverNodePerformanceMonitoringIntegrations } from "@sentry/node";
import "dotenv/config"
// Token to UserID Function
// Credits to Meister#9667 for helping me with this
const retriveUserIdbyToken = (token: string) => {
  const parseuser = token.split(".")[0];
  const buff = Buffer.from(parseuser, "base64");
  const userid = buff.toString("utf-8");
  return userid;
};

global.devBot = false;

const botId = retriveUserIdbyToken(process.env.DISCORD_TOKEN as string);
if (botId !== "981649513427111957" || process.env.STATUS === "DEVELOPMENT") {
  global.devBot = true;
} else if (
  process.env.STATUS === "DEVELOPMENT" &&
  botId === "981649513427111957"
) {
  throw new Error(
    "You were trying to start the main bot with a status of DEVELOPMENT.",
  );
}

var dsnKey = process.env.SENTRY_DSN as string;

if (dsnKey) {
  init({
    dsn: dsnKey,
    // Performance Monitoring
    tracesSampleRate: 0.5, // 1.0 means that 100% of transactions will be sent to Sentry
    integrations: [
      ...autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],
  });
}

global.wouldYouDevs = [
  "805898988402376725", // Finn
  "347077478726238228", // Dominik
  "268843733317976066", // Sky
  "510759794911739905", // Alt
];

global.checkDebug = (d, i) => {
  return d?.debugMode ?? global?.wouldYouDevs?.includes(i);
};

const client = new WouldYou();
client.loginBot().then(() => {
  console.log(
    `${white("Would You?")} ${gray(">")} ${green(
      "Bot should be started now...",
    )}`,
  );
});
