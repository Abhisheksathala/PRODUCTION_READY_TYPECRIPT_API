// types
import type { Response, Request } from 'express';
import { Iblog } from '@/models/blog';
// node modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
// custom modules
import { logger } from '@/utils/winston';

// models
import blogModel from '@/models/blog';
import userModel from '@/models/user';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

type BlogData = Pick<Iblog, 'title' | 'content' | 'banner' | 'status'>;

export const create_blog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;
    const { blogId } = req.params;

    const user = await userModel.findById(userId).select('role').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'NOT FOUND',
        message: 'the user does not exist',
        success: false,
      });
      return;
    }

    const blog = await blogModel.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'BLOG NOT FOUND',
        message: 'the blog does not exist',
        success: false,
      });
      return;
    }

    if (blog.author !== userId && userId !== blog.author) {
      res.status(403).json({
        code: 'AUTHORIZATIONERROR',
        message: 'ACCESS DENIED BECZ UR NOT THE AUTHOR',
      });
      logger.warn('a user tried to update a blog without auth', {
        blog,
        userId,
      });
    }
    if (title) blog.title = title;
    if (content) {
      const cleanconetet = purify.sanitize(content);
      blog.content = cleanconetet;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save;

    res.status(200).json({
      blog: blog,
      success: true,
      message: 'blog Updated success',
    });
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while upadting the blog', error);
  }
};
