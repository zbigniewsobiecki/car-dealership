import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class AuthController extends BaseController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return this.created(res, result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return this.ok(res, result);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return this.ok(res, result);
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.userId);
    return this.ok(res, user);
  });
}

export const authController = new AuthController();