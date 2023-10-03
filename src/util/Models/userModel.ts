import { Schema, model } from "mongoose";

export interface IUserModel{
  userID: string,
  wouldyourather: {
    yes: number,
    no: number,
    used: {
      command: number,
      replay: number
    }
  },
  neverhaveiever: {
    yes: number,
    no: number,
    used: {
      command: number,
      replay: number
    }
  },
  higherlower: {
    yes: number,
    no: number,
    highscore: number,
    used: {
      command: number,
      replay: number
    }
  },
  whatwouldyoudo: {
    yes: number,
    no: number,
    used: {
      command: number,
      replay: number
    }
  },
}

const userModelSchema = new Schema(
  {
    userID: { type: String, required: true, unique: true },

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
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      highscore: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    whatwouldyoudo: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true },
);

export const UserModel = model<IUserModel>("userModel", userModelSchema);
