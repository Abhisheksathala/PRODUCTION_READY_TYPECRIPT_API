import mongoose, { Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface Iblog {
  title: string;
  slug: string;
  content: string;
  banner: {
    publicId: string;
    url: string;
    width: number;
    hight: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCounts: number;
  status: 'draft' | 'published';
}

const blogSchema = new mongoose.Schema<Iblog>(
  {
    title: {
      type: String,
      required: [true, 'Title is requried'],
      maxLength: [100, 'Title must be less then the 100 chars'],
    },
    slug: {
      type: String,
      required: [true, 'sluge is required'],
      unique: [true, 'Sluge must be unique'],
    },
    content: {
      type: String,
      required: [true, 'content is requried'],
    },
    banner: {
      publicId: {
        type: String,
        require: [true, 'banner publicId is required'],
      },
      url: {
        type: String,
        require: [true, 'banner url is required'],
      },
      width: {
        type: Number,
        require: [true, 'banner width is required'],
      },
      hight: {
        type: Number,
        require: [true, 'banner hight is required'],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'author id is required'],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCounts: {
      type: Number,
      default: 0,
    },
    status: {
      type:String,
      enum:{
        values:["draft" , "published"],
        message:"{VALUE} is not supported"
      },
      default:"draft"
    }
  },
  {
    timestamps: true,
  },
);

const blogModel = mongoose.model<Iblog>('blog', blogSchema);

export default blogModel;
