import { Schema, model } from'mongoose';

const userProfile = new Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true },
);

module.exports = model('userProfile', userProfile);
