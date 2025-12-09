import type { Response, Request } from 'express';
import { Iblog } from '@/models/blog';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { logger } from '@/utils/winston';
import blogModel from '@/models/blog';
import userModel from '@/models/user';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

type BlogData = Partial<Pick<Iblog, 'title' | 'content' | 'banner' | 'status'>>;

export const update_blog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, banner, status } = req.body as BlogData;
    const userId = req.userId;
    const { blogId } = req.params;

    // Validate required parameters
    if (!userId) {
      res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
        success: false,
      });
      return;
    }

    if (!blogId) {
      res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Blog ID is required',
        success: false,
      });
      return;
    }

    const user = await userModel.findById(userId).select('role').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'User not found',
        success: false,
      });
      return;
    }

    const blog = await blogModel.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'BLOG_NOT_FOUND',
        message: 'Blog not found',
        success: false,
      });
      return;
    }

    if (blog.author.toString() !== userId.toString()) {
      res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Access denied. You are not the author of this blog',
        success: false,
      });
      logger.warn('User tried to update a blog without authorization', {
        blogId,
        userId,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    // Add updated timestamp
    // blog.updatedAt = new Date();

    await blog.save();

    res.status(200).json({
      blog: blog.toObject(),
      success: true,
      message: 'Blog updated successfully',
    });
  } catch (error) {
    logger.error('Error while updating the blog', error);

    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? (error as Error).message
        : 'Internal server error';

    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error',
      success: false,
      ...(process.env.NODE_ENV === 'development' && { error: errorMessage }),
    });
  }
};
