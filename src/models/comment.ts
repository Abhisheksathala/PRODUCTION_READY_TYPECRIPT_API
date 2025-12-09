import { model, Schema } from 'mongoose';
import { Types } from 'mongoose';

interface Icomment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
}

const CommentsSchema = new Schema<Icomment>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'blog' },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    content: {
      type: String,
      required: [true, 'commet is requeried'],
    },
  },
  { timestamps: true },
);

const commentModel = model<Icomment>('comment', CommentsSchema);

export default commentModel;
