import { CoreTranslations } from '@typings/translations';

const core: CoreTranslations = {
  name: 'Would You',
  description:
    'Would You bot is an open-source discord bot that includes activities and questions to keep your server active!',
  error: {
    interaction: 'An error occurred. Please try again later.',
    cooldown: 'You need to wait {cooldown} seconds before using this command again.',
    permissions: 'You are missing the following permissions to use this interaction: {permissions}.',
    noCustom: 'There are no custom questions for this server, please add some!',
  },
  terms: {
    yes: 'Yes',
    no: 'No',
    vote: 'Vote',
    votingResults: 'Voting Results',
    id: 'ID',
    message: 'Message',
    category: 'Category',
    content: 'Content',
    enable: 'Enable',
    disable: 'Disable',
  },
};

export default core;
