const customQueue: Record<string, string[]> = {
  info: [],
  error: [],
  warn: [],
  debug: [],
};

export default customQueue;

/* eslint-disable no-control-regex */
const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;

/**
 * Add a discord log to the queue.
 * @param level The level of the log.
 * @param message The log message.
 */
export const addDiscordLog = (level: string, message: string): void => {
  const lvl = level.replace(ANSI_REGEX, '');

  if (lvl === 'info') customQueue.info.push(message);
  if (lvl === 'error') customQueue.error.push(message);
  if (lvl === 'warn') customQueue.warn.push(message);
  customQueue.debug.push(message);
};
