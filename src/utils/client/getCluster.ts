import { client } from 'src';

/**
 * Get the current cluster id.
 * @returns The current cluster id.
 */
export const getClusterId = () => client?.cluster?.id || 0;
