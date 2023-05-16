import { client } from 'src/app';

export const getClusterId = () => client?.cluster?.id || 0;
