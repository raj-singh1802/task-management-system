import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthPayload } from '../types';

export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
};

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
};