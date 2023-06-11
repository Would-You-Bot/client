import { BotTranslations } from '@typings/translations';

const bot: BotTranslations = {
  customImport: {
    content: {
      imported: '',
    },
  },
  generalSettings: {
    content: {
      sameTimezone: '',
      invalidTimezone: '',
      sameQuestionType: '',
      questionType: '',
    },
    embed: {
      title: '',
      description: '',
      timezone: '',
      packType: '',
    },
  },
  dailySettings: {
    content: {
      channel: '',
      role: '',
      sameTime: '',
      invalidTime: '',
    },
    embed: {
      title: '',
      description: '',
      dailyChannel: '',
      dailyRole: '',
      dailyTime: '',
      dailyThread: '',
    },
    buttons: {
      enable: '',
      disable: '',
      channel: '',
      role: '',
      time: '',
      thread: {
        enable: '',
        disable: '',
      },
    },
  },
  welcomeSettings: {
    content: {
      channel: '',
      role: '',
    },
    embed: {
      title: '',
      description: '',
      ping: '',
      channel: '',
    },
  },
  ping: {
    embed: {
      title: '',
      api: '',
      client: '',
    },
    buttons: {
      label: '',
    },
  },
  language: {
    embed: {
      error: '',
    },
  },
  support: {
    embed: {
      title: '',
      description: '',
    },
  },
  help: {
    embed: {
      title: '',
      description: '',
      fields: [
        {
          name: '',
          value: '',
        },
        {
          name: '',
          value: '',
        },
      ],
    },
    buttons: {
      label: '',
    },
  },
  guide: {
    embed: {
      title: '',
      description: '',
      fields: [
        {
          name: '',
          value: '',
        },
        {
          name: '',
          value: '',
        },
        {
          name: '',
          value: '',
        },
      ],
    },
  },
  vote: {
    embed: {
      title: '',
      value: '',
    },
    button: {
      label: '',
    },
  },
};

export default bot;
