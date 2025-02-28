import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  answer: string;
  hint?: string;
  publishDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    hint: { type: String },
    publishDate: { type: Date, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Check if models are already defined to prevent errors in development with hot reloading
export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);