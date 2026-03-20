import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { ApiError } from '../utils/apiError';
import { RegisterInput, LoginInput } from '../types';

export const registerUser = async (input: RegisterInput) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const payload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
};

export const loginUser = async (input: LoginInput) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate tokens
  const payload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (token: string) => {
  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Find user and validate stored token
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Generate new tokens
  const newPayload = { userId: user.id, email: user.email };
  const accessToken = generateAccessToken(newPayload);
  const refreshToken = generateRefreshToken(newPayload);

  // Update stored refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

export const logoutUser = async (token: string) => {
  // Find user with this refresh token
  const user = await prisma.user.findFirst({
    where: { refreshToken: token },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Clear refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
};