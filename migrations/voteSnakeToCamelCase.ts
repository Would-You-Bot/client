import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/my_database');

const oldVoteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  guild: { type: String, required: false },
  channel: { type: String, required: true },
  type: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  votes: {
    op_one: { type: Array, default: [] },
    op_two: { type: Array, default: [] },
    require: true,
  },
  until: { type: Date, required: false },
});

const oldVoteModel = mongoose.model('voteModel', oldVoteSchema);

const newVoteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  guild: { type: String, required: false },
  channel: { type: String, required: true },
  type: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  votes: {
    optionOne: { type: Array, default: [] },
    optionTwo: { type: Array, default: [] },
  },
  until: { type: Date, required: false },
});

const newVoteModel = mongoose.model('voteModel', newVoteSchema);

async function migration() {
  const allDocs = await oldVoteModel.find();

  for (const doc of allDocs) {
    const votes = doc.toObject().votes;

    if (!votes) {
      console.log(`Deleting document: ${doc._id}`);
      await doc.deleteOne();
      return;
    }

    const { op_one, op_two, ...rest } = votes;
    const updated = { ...rest, votes: { opOne: op_one, opTwo: op_two } };
    await newVoteModel.findByIdAndUpdate(doc.id, updated);
  }
}

export default () => {
  migration()
    .then(() => {
      console.log('Vote (Snake to Camel Case) migration successful!');
      mongoose.disconnect();
    })
    .catch((error) => {
      console.error('Vote (Snake to Camel Case) migration failed!', error);
      mongoose.disconnect();
    });
};
