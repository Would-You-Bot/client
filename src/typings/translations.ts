/**
 * Define variables in translation files in the format: {variable}.
 * These variables must be replaced with the correct value before sending the message in the respective files that use the translations.
 */

export interface CoreTranslations {
  name: string;
  description: string;
  error: {
    interaction: string;
    cooldown: string;
    permissions: string;
    noCustom: string;
  };
  terms: {
    yes: string;
    no: string;
    vote: string;
    votingResults: string;
    id: string;
    message: string;
    category: string;
    content: string;
    enable: string;
    disable: string;
  };
}

/* type BotInterface = Record<
  string,
  {
    content?: Record<string, string>;
    embed?: Record<string, string | Record<string, string> | { name: string; value: string }[]>;
    buttons?: Record<string, string | Record<string, string>>;
  }
>; */

export interface BotTranslations {
  customImport: {
    content: {
      imported: string;
    };
  };
  generalSettings: {
    content: {
      sameTimezone: string;
      invalidTimezone: string;
      sameQuestionType: string;
      questionType: string;
    };
    embed: {
      title: string;
      description: string;
    };
  };
  // language: {};
  // premium: {}
  // welcome: {};
  dailySettings: {
    content: {
      sameTime: string;
      invalidTime: string;
      channel: string;
      role: string;
    };
    embed: { title: string; description: string };
    buttons: {
      channel: string;
      role: string;
      time: string;
      thread: {
        enable: string;
        disable: string;
      };
    };
  };
  // debug: {}
  welcomeSettings: {
    content: {
      channel: string;
      role: string;
    };
    embed: {
      title: string;
      description: string;
    };
  };
  ping: {
    embed: {
      title: string;
      api: string;
      client: string;
    };
    buttons: {
      label: string;
    };
  };
  language: {
    embed: {
      error: string;
    };
  };
  support: {
    embed: {
      title: string;
      description: string;
    };
  };
  help: {
    embed: {
      title: string;
      description: string;
      fields: [
        {
          name: string;
          value: string;
        },
        {
          name: string;
          value: string;
        }
      ];
    };
    button: {
      label: string;
    };
  };
  guide: {
    embed: {
      title: string;
      description: string;
      fields: [
        {
          name: string;
          value: string;
        },
        {
          name: string;
          value: string;
        },
        {
          name: string;
          value: string;
        }
      ];
    };
  };
  // packs: {};
  vote: {
    embed: {
      title: string;
      value: string;
    };
    button: {
      label: string;
    };
  };
}

export interface GameTranslations {
  wwyd: {
    embed: {
      title: string;
      footer: string;
      option1: string;
      option2: string;
    };
  };
  wyr: {
    embed: {
      title: string;
    };
    button: {
      custom: string;
    };
  };
}

export interface Translations
  extends CoreTranslations,
    BotTranslations,
    GameTranslations {}
