import mongoose, { Schema, Document } from 'mongoose';
import { IQuestion } from './Question';

export interface ISubmission extends Document {
  questionId: mongoose.Types.ObjectId | IQuestion;
  name: string;
  answer: string;
  correct: boolean;
  createdAt: Date;
}

const SubmissionSchema: Schema = new Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    name: { type: String, required: true },
    answer: { type: String, required: true },
    correct: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// Compound index for preventing multiple submissions from the same person for a question
SubmissionSchema.index({ questionId: 1, name: 1 }, { unique: true });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);