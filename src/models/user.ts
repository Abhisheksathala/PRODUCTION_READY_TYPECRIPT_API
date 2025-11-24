import { kMaxLength } from 'buffer';
import { timeStamp } from 'console';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstname?: string;
  lastname?: string;
  socialLinks?: {
    websit?: string;
    facebook?: string;
    instagram?: string;
    Linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      masLength: [20, 'username must be less then 20 character'],
      unique: [true, 'username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [50, 'Email must be less then 50 chartecters'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'password is rquired'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'ROLE is Required'],
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    firstname: {
      type: String,
      maxLength: [20, 'firstname MUST BE LESS THEN CHARS'],
    },
    lastname: {
      type: String,
      maxLength: [20, 'lastname MUST BE LESS THEN CHARS'],
    },
    socialLinks: {
      websit: {
        type: String,
        kMaxLength: [100, 'Websit address must be less then 100 chars'],
      },
      facebook: {
        type: String,
        kMaxLength: [100, 'facebook address must be less then 100 chars'],
      },
      instagram: {
        type: String,
        kMaxLength: [100, 'instagram address must be less then 100 chars'],
      },
      x: {
        type: String,
        kMaxLength: [100, 'x address must be less then 100 chars'],
      },
      Linkedin: {
        type: String,
        kMaxLength: [100, 'Linkdin address must be less then 100 chars'],
      },
      youtube: {
        type: String,
        kMaxLength: [100, 'youtube address must be less then 100 chars'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  // hash password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const userModel = mongoose.model<IUser>('user', userSchema);

export default userModel;
