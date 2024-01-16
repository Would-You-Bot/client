declare global {
  var devBot: boolean;
  var wouldYouDevs: string[];
  var checkDebug: (d, i) => boolean;
}

export {};
export interface IQueueMessage {
  guildId: string;
  message: [string, number];
  type: string;
  role: string | null;
  thread: boolean;
  webhook: {
    id: string | null;
    token: string | null;
  };
  channelId: string | null;
}
