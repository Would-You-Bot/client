const { Schema, model } = require('mongoose');

const voteModel = new Schema({
  message: { type: String, required: true },
  guild: { type: String, required: false },
  channel: { type: String, required: true },
  type: { type: Number, default: 0 }, // 0 = wouldyourather, 1 = neverhaveiever, 2 = wwyd

  texts: { 
    1: {  type: String,   default: ""  },
    2: {  type: String,  default: ""}
  },

    votes: {
        
    },

  until: {  type: Date,  required: false }
});

module.exports = model('voteModel', voteModel);
