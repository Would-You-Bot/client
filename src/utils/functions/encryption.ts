import crypto from 'crypto';

import config from '@config';
import { logger } from '@utils/client';

// Generate secret hash to use for encryption
const key = crypto
  .createHash('sha512')
  .update(config.env.SECRET_KEY)
  .digest('hex')
  .substring(0, 32);
const encryptionIV = crypto
  .createHash('sha512')
  .update(config.env.SECRET_IV)
  .digest('hex')
  .substring(0, 16);

/**
 * Encrypts data using the secret key and iv.
 * @param data The data to encrypt.
 * @returns The encrypted data.
 */
export const encrypt = (data: string): string | undefined => {
  try {
    // Creates cipher with encryption method and secret key
    const cipher = crypto.createCipheriv(
      config.env.ENCRYPTION_METHOD,
      key,
      encryptionIV
    );

    // Encrypts data and converts to hex and base64
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Decrypts data using the secret key and iv.
 * @param data The encrypted data to decrypt.
 * @returns The decrypted data.
 */
export const decrypt = (data: string): string | undefined => {
  try {
    const buff = Buffer.from(data, 'base64');
    const decipher = crypto.createDecipheriv(
      config.env.ENCRYPTION_METHOD,
      key,
      encryptionIV
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ); // Decrypts data and converts to utf8
  } catch (error) {
    logger.error(error);
  }
};
