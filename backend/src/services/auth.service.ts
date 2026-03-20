import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { ApiError } from '../utils/apiError';
import { RegisterInput, LoginInput } from '../types';

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  const payload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await comparePassword(input.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const payload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (token: string) => {
  const payload = verifyRefreshToken(token);

  const user = await User.findById(payload.userId);
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const newPayload = { userId: user._id.toString(), email: user.email };
  const accessToken = generateAccessToken(newPayload);
  const refreshToken = generateRefreshToken(newPayload);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const logoutUser = async (token: string) => {
  const user = await User.findOne({ refreshToken: token });
  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  user.refreshToken = null;
  await user.save();

  return { message: 'Logged out successfully' };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};
