import { Response } from 'express';
import { PaginatedResponse } from '@car-dealership/shared-types';

export class BaseController {
  /**
   * Send a standard success response
   */
  protected ok<T>(res: Response, data?: T) {
    return res.status(200).json({
      success: true,
      data,
    });
  }

  /**
   * Send a 201 Created response
   */
  protected created<T>(res: Response, data?: T) {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  /**
   * Send a success message response
   */
  protected message(res: Response, message: string) {
    return res.status(200).json({
      success: true,
      message,
    });
  }

  /**
   * Send a paginated response
   */
  protected paginate<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number
  ) {
    const response: PaginatedResponse<T> = {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return res.status(200).json({
      success: true,
      ...response,
    });
  }
}