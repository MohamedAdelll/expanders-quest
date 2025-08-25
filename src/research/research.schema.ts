import * as Mongoose from 'mongoose';

export const MODEL_NAME = 'Research';
export const ResearchSchema = new Mongoose.Schema({
  projectId: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String },
  tags: { type: [String], default: [] },
});

export type ResearchDocument = Mongoose.HydratedDocument<typeof ResearchSchema>;
