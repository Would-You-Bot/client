import { BotTranslations } from '@typings/translations';

const bot: BotTranslations = {
  customImport: {
    content: {
      imported: 'Successfully imported the "{pack}" pack!',
    },
  },
  generalSettings: {
    content: {
      sameTimezone:
        'The provided timezone is the same timezone that is already set. Make sure to choose a different timezone.',
      invalidTimezone:
        'Provided timezone was invalid, you can pick a valid timezone from this [Time Zone Picker](https://kevinnovak.github.io/Time-Zone-Picker/)',
      sameQuestionType:
        'The provided question type is the same type that is already set. Make sure to choose a different type.',
      questionType: 'Select the type of questions you want to receive.',
    },
    embed: {
      title: '{name} - General Settings',
      description: '**Timezone**\n{timezone}\n**Question Type**\n{questionType}',
    },
  },
  dailySettings: {
    content: {
      channel: 'Select the channel where you want Daily Messages to be.',
      role: 'Select a role that you want to be pinged in Daily Messages.',
      sameTime:
        'The provided interval is the same interval that is already set. Make sure to choose a different interval.',
      invalidTime:
        'Provided interval was invalid. Make sure your interval is in the 24h format and mintues are either 00 or 30!',
    },
    embed: {
      title: '{name} - Daily Messages',
      description:
        '**Enabled:**\n{enabled}\n**Channel:**\n{channel}\n**Role:**\n{role}\n**Time:**\n{time}\n**Thread:**\n{thread}',
    },
    buttons: {
      channel: 'Set Channel',
      role: 'Set Role',
      time: 'Set Time',
      thread: {
        enable: 'Enable Thread',
        disable: 'Disable Thread',
      },
    },
  },
  welcomeSettings: {
    content: {
      channel: 'Select the channel where you want Welcome Messages to be.',
      role: 'Select a role that you want to be pinged in Welcome Messages.',
    },
    embed: {
      title: '{name} - Welcomes',
      description: '**Enabled:**\n{enabled}\n**Channel:**\n{channel}\n**User Pings:**\n{ping}',
    },
  },
  ping: {
    embed: {
      title: '🏓 Pong!',
      api: 'API Latency',
      client: 'Client Latency',
    },
    buttons: {
      label: 'Discord API latency',
    },
  },
  language: {
    embed: {
      error: 'You are missing the `Manage Guild` permission to use this command!',
    },
  },
  support: {
    embed: {
      title: '{name} - Support',
      description:
        'If you ever need help with anything, just contact the **support team** on our **[Support Server](https://discord.gg/vMyXAxEznS)!**',
    },
  },
  help: {
    embed: {
      title: 'Help',
      description: '**{name}** is a discord bot built to increase discord server activity.',
      fields: [
        {
          name: '**My Commands**',
          value:
            '`/Would You` - Start a discussion about random powers\n`/ping` - Pong!\n`/language` - Change the language of the bot for the server\n`/help` - Shows this info\n`/rather` - Gives you two powers to choose from\n`/custom` - Sends a custom would you message in the chat!\n`/wwyd` - Sends a what would you do question in the chat\n`/welcome` - Add or remove the welcome channel!\n`/support` - If you ever need help on the bot, use this command to get help from the support team!',
        },
        {
          name: '**Privacy Policy**',
          value:
            'We value your privacy. If you have any concerns about your data, check out privacy policy [here](https://wouldyoubot.gg/privacy).',
        },
      ],
    },
    button: {
      label: 'Our Discord',
    },
  },
  guide: {
    embed: {
      title: '{name} - Guide',
      description: 'Guide to use the full potential of {name}.',
      fields: [
        {
          name: 'How to correctly use {name}!',
          value:
            "Create a dedicated channel for the bot or allow users to use the bot in the main chat. \n > {name}'s purpose is to make chats more active so it would be very ironic to deny the usage of {name} in main chats. \n > If you want to use the bot to its fullest potential, use the </welcome:1011374285350260914> command and setup a welcome channel. The channel will be used to send a {name} message once a user joins.",
        },
        {
          name: 'Why do I need that?',
          value:
            '> The intention behind this is to help new users be part of the conversation by giving the members a topic to talk about right after joining! This not only makes the server more active, but it also makes new users feel more included right after joining the server and encourages them to stay for longer!',
        },
        {
          name: 'Any more tips?',
          value:
            '> Yes! Make sure to talk about the topic you got instead of spamming the commands. This will help the members build a conversation and make the server more active in minutes! There is an image attached with a prime example on how to use the bot!',
        },
      ],
    },
  },
  vote: {
    embed: {
      title: 'Voting helps **Would You** gain more users! Make sure to vote every day!',
      value: 'Click to vote',
    },
    button: {
      label: 'Vote',
    },
  },
};

export default bot;
