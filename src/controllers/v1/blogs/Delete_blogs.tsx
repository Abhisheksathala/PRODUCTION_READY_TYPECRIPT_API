// types
import type { Response, Request } from 'express';
import { Iblog } from '../../../models/blog';
// custom modules
import { logger } from '../../../utils/winston';
// models
import blogModel from '../../../models/blog';
import userModel from '../../../models/user';

export const Delete_blogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await userModel.findById(userId).select('role').lean().exec();
    const blog = await blogModel
      .findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NOT FOUND',
        message:
          'THE USER UR SEACRCHN DOS NOT EXIST BRO BE A GOOD BOY AND SEND CORRECT ID"s ',
        success: false,
      });
      return;
    }
    if (!blog) {
      res.status(404).json({
        code: 'NOT FOUND',
        message:
          'THE BLOG UR SEACRCHN DOS NOT EXIST BRO BE A GOOD BOY AND SEND CORRECT ID"s ',
        success: false,
      });
      return;
    }

    const isAdmin = user.role === 'admin';
    // Check authorization
    const isAuthor = user._id.toString() === blog.author.toString();

    if (!isAuthor && !isAdmin) {
      res.status(403).json({
        code: 'FORBIDDEN',
        message: 'You are not authorized to delete this blog',
        success: false,
      });
      // logger.warn()
      return;
    }

    await blogModel.findByIdAndDelete(blogId);

    // if (blog.banner?.publicId) {
    //   await cloudinary.uploader.destroy(blog.banner.publicId);
    // }

    logger.info('Blog has been deleted', {
      blogId,
      deletedBy: userId,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      blog: blogId,
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while deleting the currentuser', error);
  }
};

export default Delete_blogs;
