import mongoose, { Schema } from 'mongoose';
import { Types } from 'mongoose';

interface likes {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
}

const liksSchema = new Schema<likes>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'blog' },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
);
