import { Schema, model } from "mongoose";

export interface IUserModel {
  userID: { type: string; required: true };
  votePrivacy: boolean;
  language: string;
  wouldyourather: {
    yes: number;
    no: number;
    used: {
      command: number;
      replay: number;
    };
  };
  neverhaveiever: {
    yes: number;
    no: number;
    used: {
      command: number;
      replay: number;
    };
  };
  higherlower: {
    highscore: number;
    used: {
      command: number;
      replay: number;
    };
  };
  whatwouldyoudo: {
    yes: number;
    no: number;
    used: {
      command: number;
      replay: number;
    };
  };
  truth: {
    used: {
      command: number;
      replay: number;
    };
  };
  dare: {
    used: {
      command: number;
      replay: number;
    };
  };
  random: {
    used: {
      command: number;
      replay: number;
    };
  };
  topic: {
    used: {
      command: number;
      replay: number;
    };
  };
}

const userModelSchema = new Schema(
  {
    userID: { type: String, unique: true },
    votePrivacy: { type: Boolean, default: false },
    language: { type: String, default: "en_EN" },
    wouldyourather: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    neverhaveiever: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    higherlower: {
      highscore: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    whatwouldyoudo: {
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    truth: {
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    dare: {
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    random: {
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    topic: {
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true },
);

export const UserModel = model<IUserModel>("userModel", userModelSchema);
