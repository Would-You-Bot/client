export interface IConfig {
  status: string[];
  emojis: {
    info: {
      dominik: string;
      sky: string;
      skelly: string;
      paul: string;
      paulos: string;
    };
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
      skelly: "<:Skelly:1266007691046948875>",
      paul: "<:Paul:1266007714497167371>",
      paulos: "<:Paulos:1266007734688677928>",
    },
  },
};

export default Config;
