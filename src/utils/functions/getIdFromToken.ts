/**
 * Gets the ID from a bot token - credit to Meister#9667
 * @param token The bot token to get the ID from
 */
const getIdFromToken = (token: string): string => {
  const parseuser = token.split('.')[0];
  const buff = Buffer.from(parseuser, 'base64');
  const userid = buff.toString('utf-8');
  return userid;
};

export default getIdFromToken;
