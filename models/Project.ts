import {Schema, model, models} from 'mongoose';

const ProjectSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  userName: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  twitterHandle: {
    type: String,
    required: true,
  },
  nftsCount: {
    type: String,
    required: true,
  },
  drop: {
    type: String,
    required: true,
  },
  discord: {
    type: String,
  },
  website: {
    type: String,
  },
  samples: [{
    type: String
  }]
}, { timestamps: true })

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
