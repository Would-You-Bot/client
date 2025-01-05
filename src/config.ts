export interface IConfig {
  status: string[];
  emojis: {
    info: Record<string, string>;
  };
}

const Config: IConfig = {
  status: [
    "Would You Rather",
    "Truth or Dare",
    "What Would You Do",
    "Higher or Lower",
    "Never Have I Ever",
    "Question of the day",
  ],
  emojis: {
    info: {
      dominik: "<:Dominik:1266007619802501201>",
      sky: "<:Sky:1266007665327214684>",
      skelly: "<:Skelly:1321568666457735259>",
      paulos: "<:Paulos:1321568776600420383>",
      tee: "<:Tee:1321568802240204912>",
      woofer: "<:Woofer:1321568826458116267>",
    },
  },
};

export default Config;
