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

    const cleanContent = purify.sanitize(content);

    const newBlog = new blogModel({
      title: title,
      content: cleanContent,
      banner: banner,
      status: status,
      author: userId,
    });

    await newBlog.save();

    logger.info('New blog has been created', newBlog);

    res.status(200).json({
      blog: newBlog,
      success: true,
      message: 'blog created success',
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
