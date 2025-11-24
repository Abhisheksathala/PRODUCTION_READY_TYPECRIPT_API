import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const UpdateCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;

  const {
    username,
    email,
    password,
    firstname,
    lastname,
    website,
    insta,
    linkedin,
    x,
    youtube,
  } = req.body;

  if (!userId) {
    res.status(400).json({
      code: 'MissingUserId',
      message: 'User ID is missing in request',
      success: false,
    });
    return;
  }
  try {
    const user = await userModel
      .findById(userId)
      .select('+password -__v')
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'user not Found',
        success: false,
      });
      return;
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (website) user.socialLinks.websit = website;
    if (insta) user.socialLinks.instagram = insta;
    if (linkedin) user.socialLinks.Linkedin = linkedin;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();

    res.status(200).json({
      code: 'UpdateSuccess',
      message: 'user profile updated successfully',
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while updateing the currentuser', error);
  }
};

export default UpdateCurrentUser;
