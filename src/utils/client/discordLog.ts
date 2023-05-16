import { TextChannel } from 'discord.js';
import { ExtendedClient } from 'src/client';
import { debugQueue, errorQueue, infoQueue, warnQueue } from './logValues';

/* eslint-disable no-control-regex */
const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;

let processingDebug = false;
let processingInfo = false;
let processingWarn = false;
let processingError = false;

/**
 * Sends a message to the Discord channel.
 * @param channel The channel to send the message to.
 * @param message The final message to send.
 * @returns Whether the message was sent or not.
 */
const sendMessage = async (channel: TextChannel, message: string) => {
  try {
    await channel.send(`\`\`\`yaml\n${message}\`\`\``);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Sends info messages to the Discord channel.
 * @param client The extended client.
 */
const sendInfo = async (client: ExtendedClient) => {
  if (!(infoQueue.length > 0) || processingInfo) return;

  processingInfo = true;

  const channel = (await client.channels.fetch('1107648942574948372')) as
    | TextChannel
    | undefined;

  if (!channel) {
    processingInfo = false;
    return;
  }

  let message = '';
  let messageSent = false;

  // Send logs until the message is too long or there are no more logs
  while (infoQueue.length > 0 && !messageSent) {
    const infoMessage = infoQueue[0].replace(ANSI_REGEX, '');

    // If the message/log is too long, remove it from the queue
    if (infoMessage.length > 1500) {
      infoQueue.shift();
      continue;
    }

    // If the message (with new log) is too long, send it (without new log) and continue
    if (message.length + infoMessage.length > 1500) {
      messageSent = await sendMessage(channel, message);
    }

    // Add the log to the message
    message += `${infoMessage}\n`;

    // Remove the log from the queue
    infoQueue.shift();
  }

  // Send any remaining logs
  if (!messageSent && message.length > 0) {
    await sendMessage(channel, message);
  }

  processingInfo = false;
};

/**
 * Sends warn messages to the Discord channel.
 * @param client The extended client.
 */
const sendWarn = async (client: ExtendedClient) => {
  if (!(warnQueue.length > 0) || processingWarn) return;

  processingWarn = true;

  const channel = (await client.channels.fetch('1106024493631160453')) as
    | TextChannel
    | undefined;

  if (!channel) {
    processingWarn = false;
    return;
  }

  let message = '';
  let messageSent = false;

  // Send logs until the message is too long or there are no more logs
  while (warnQueue.length > 0 && !messageSent) {
    const warnMessage = warnQueue[0].replace(ANSI_REGEX, '');

    // If the message/log is too long, remove it from the queue
    if (warnMessage.length > 1500) {
      warnQueue.shift();
      continue;
    }

    // If the message (with new log) is too long, send it (without new log) and continue
    if (message.length + warnMessage.length > 1500) {
      messageSent = await sendMessage(channel, message);
    }

    // Add the log to the message
    message += `${warnMessage}\n`;

    // Remove the log from the queue
    warnQueue.shift();
  }

  // Send any remaining logs
  if (!messageSent && message.length > 0) {
    await sendMessage(channel, message);
  }

  processingWarn = false;
};

/**
 * Sends error messages to the Discord channel.
 * @param client The extended client.
 */
const sendError = async (client: ExtendedClient) => {
  if (!(errorQueue.length > 0) || processingError) return;

  processingError = true;

  const channel = (await client.channels.fetch('1106024503315812392')) as
    | TextChannel
    | undefined;

  if (!channel) {
    processingError = false;
    return;
  }

  let message = '';
  let messageSent = false;

  // Send logs until the message is too long or there are no more logs
  while (errorQueue.length > 0 && !messageSent) {
    const errorMessage = errorQueue[0].replace(ANSI_REGEX, '');

    // If the message/log is too long, remove it from the queue
    if (errorMessage.length > 1500) {
      errorQueue.shift();
      continue;
    }

    // If the message (with new log) is too long, send it (without new log) and continue
    if (message.length + errorMessage.length > 1500) {
      messageSent = await sendMessage(channel, message);
    }

    // Add the log to the message
    message += `${errorMessage}\n`;

    // Remove the log from the queue
    errorQueue.shift();
  }

  // Send any remaining logs
  if (!messageSent && message.length > 0) {
    await sendMessage(channel, message);
  }

  processingError = false;
};

/**
 * Sends debug messages to the Discord channel.
 * @param client The extended client.
 */
const sendDebug = async (client: ExtendedClient) => {
  if (!(debugQueue.length > 0) || processingDebug) return;

  processingDebug = true;

  const channel = (await client.channels.fetch('1106024539470692373')) as
    | TextChannel
    | undefined;

  if (!channel) {
    processingDebug = false;
    return;
  }

  let message = '';
  let messageSent = false;

  // Send logs until the message is too long or there are no more logs
  while (debugQueue.length > 0 && !messageSent) {
    const debugMessage = debugQueue[0].replace(ANSI_REGEX, '');

    // If the message/log is too long, remove it from the queue
    if (debugMessage.length > 1500) {
      debugQueue.shift();
      continue;
    }

    // If the message (with new log) is too long, send it (without new log) and continue
    if (message.length + debugMessage.length > 1500) {
      messageSent = await sendMessage(channel, message);
    }

    // Add the log to the message
    message += `${debugMessage}\n`;

    // Remove the log from the queue
    debugQueue.shift();
  }

  // Send any remaining logs
  if (!messageSent && message.length > 0) {
    await sendMessage(channel, message);
  }

  processingDebug = false;
};

/**
 * Initialize the discord log functions to run in intervals..
 * @param client The extended client.
 */
export const initDiscordLogs = (client: ExtendedClient) => {
  // Initialize the info logs to send to discord in internals
  setInterval(() => {
    sendInfo(client);
  }, 1000 * 5);

  // Initialize the warn logs to send to discord in internals
  setInterval(() => {
    sendWarn(client);
  }, 1000 * 5);

  // Initialize the error logs to send to discord in internals
  setInterval(() => {
    sendError(client);
  }, 1000 * 5);

  // Initialize the debug logs to send to discord in internals
  setInterval(() => {
    sendDebug(client);
  }, 1000 * 5);
};

export default {};
