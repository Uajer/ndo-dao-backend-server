import {Schema, model, models} from 'mongoose';

const ProposalSchema = new Schema({
  endDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  text: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  yesVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  noVotes: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true })


const Proposal = models.Proposal || model('Proposal', ProposalSchema);

export default Proposal;
