declare global {
  var devBot: boolean;
  var wouldYouDevs: string[];
  var checkDebug: (d, i) => boolean;
  type CanJSON =
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly CanJSON[]
    | { readonly [key: string]: CanJSON }
    | { toJSON(): CanJSON };
}

export {};

/**
 * Everything underneath this is used by the daily message service.
 * Result<T,E> is used to elevate the possible error messages to our dailymessage listen function, this so we can get an exact error message when something goes wrong (cause)
 * DONT TOUCH UNLESS NEEDED.
 */
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
export type Result<T, E extends Error = Error> =
  | { success: true; result: T }
  | { success: false; error: E };
