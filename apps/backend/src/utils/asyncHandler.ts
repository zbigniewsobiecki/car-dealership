import { Request, Response, NextFunction } from 'express';

/**
 * A wrapper to catch async errors and pass them to next(),
 * removing the need for try-catch in every controller method.
 */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | void;

/**
 * A wrapper to catch async errors and pass them to next(),
 * removing the need for try-catch in every controller method.
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};