import { model, Schema, type Types } from 'mongoose';

export interface NoteDocument {
  user: Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<NoteDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, default: '' },
  },
  { timestamps: true },
);

noteSchema.index({ user: 1, updatedAt: -1 });

export default model<NoteDocument>('Note', noteSchema);
