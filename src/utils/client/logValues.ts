export const infoQueue: string[] = [];
export const errorQueue: string[] = [];
export const warnQueue: string[] = [];
export const debugQueue: string[] = [];

/* eslint-disable no-control-regex */
const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;

const addDiscordLog = (level: string, message: string) => {
  const lvl = level.replace(ANSI_REGEX, '');

  if (lvl === 'info') infoQueue.push(message);
  if (lvl === 'error') errorQueue.push(message);
  if (lvl === 'warn') warnQueue.push(message);
  debugQueue.push(message);
};

export default addDiscordLog;
