/**
 * Define variables in translation files in the format: {variable}.
 * These variables must be replaced with the correct value before sending the message in the respective files that use the translations.
 */

export interface CoreTranslations {
  name: string;
  description: string;
  error: {
    interaction: string;
    cooldown: `${string}{cooldown}${string}`;
    permissions: `${string}{permissions}${string}`;
  };
}

export interface BotTranslations {
  settings: {
    general: {
      content: {
        sameTimezone: string;
        invalidTimezone: string;
        sameQuestionType: string;
        questionType: string;
      };
      embed: {
        title: `{name} - ${string}`;
        description: string;
      };
    };
    // language: {};
    // premium: {}
    // welcome: {};
    daily: {
      content: {
        sameTime: string;
        invalidTime: string;
        channel: string;
        role: string;
      };
      embed: { title: `{name} - ${string}`; description: string };
      button: {
        enabled: {
          enable: string;
          disable: string;
        };
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
    welcome: {
      content: {
        channel: string;
        role: string;
      };
      embed: {
        title: `{name} - ${string}`;
        description: string;
      };
    };
  };
  ping: {
    embed: {
      title: string;
      api: string;
      client: string;
    };
    button: {
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
      title: `{name} - ${string}`;
      description: string;
    };
  };
  help: {
    embed: {
      title: string;
      description: `**{name}** ${string}`;
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
      title: `{name} - ${string}`;
      description: `${string}{name}${string}`;
      fields: [
        {
          name: `${string}{name}${string}`;
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

export interface Translations extends CoreTranslations, BotTranslations, GameTranslations {}
