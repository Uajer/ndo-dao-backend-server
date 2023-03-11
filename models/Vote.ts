import {Schema, model, models} from 'mongoose';

const VoteSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  proposal: {
    type: Schema.Types.ObjectId,
    ref: 'proposal'
  },
  nfts: [{
    type: String
  }],
  vote: {
    type: String,
    enum: ['yes', 'no', 'null'],
    default: 'null',
    required: true,
  }
}, { timestamps: true })


const Vote = models.Vote || model('Vote', VoteSchema);

export default Vote;
