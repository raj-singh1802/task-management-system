import { Request, Response } from 'express';
import { catchAsync } from '../utils/apiError';
import { registerSchema, loginSchema } from '../utils/validation';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getMe,
} from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const validated = registerSchema.parse(req.body);
  const result = await registerUser(validated);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const validated = loginSchema.parse(req.body);
  const result = await loginUser(validated);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  const result = await refreshTokens(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Tokens refreshed successfully',
    data: result,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  const result = await logoutUser(refreshToken);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const user = await getMe(req.user!.userId);
  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: { user },
  });
});
